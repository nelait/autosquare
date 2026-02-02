#!/bin/bash
# AutoSquare GCP Setup Script
# Run this script to set up your GCP project for the MCP server

set -e

echo "🚀 AutoSquare GCP Setup"
echo "========================"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get current project or prompt for one
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ -z "$CURRENT_PROJECT" ]; then
    echo "No default project set."
    read -p "Enter your GCP project ID: " PROJECT_ID
else
    echo "Current project: $CURRENT_PROJECT"
    read -p "Use this project? (y/n): " USE_CURRENT
    if [ "$USE_CURRENT" = "y" ]; then
        PROJECT_ID=$CURRENT_PROJECT
    else
        read -p "Enter your GCP project ID: " PROJECT_ID
    fi
fi

echo ""
echo "📋 Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

echo ""
echo "🔧 Enabling required APIs..."

# Enable required APIs
APIS=(
    "secretmanager.googleapis.com"      # Secret Manager
    "bigtable.googleapis.com"           # BigTable
    "bigtableadmin.googleapis.com"      # BigTable Admin
    "run.googleapis.com"                # Cloud Run
    "cloudbuild.googleapis.com"         # Cloud Build
    "artifactregistry.googleapis.com"   # Artifact Registry
    "iam.googleapis.com"                # IAM
)

for api in "${APIS[@]}"; do
    echo "  Enabling $api..."
    gcloud services enable $api --quiet
done

echo ""
echo "✅ APIs enabled successfully!"

echo ""
echo "🔐 Setting up Secret Manager..."

# Check if OpenAI secret exists
if gcloud secrets describe openai-api-key &>/dev/null; then
    echo "  Secret 'openai-api-key' already exists"
else
    echo "  Creating secret 'openai-api-key'..."
    read -sp "Enter your OpenAI API key: " OPENAI_KEY
    echo ""
    echo -n "$OPENAI_KEY" | gcloud secrets create openai-api-key --data-file=-
    echo "  ✅ Secret created"
fi

echo ""
echo "📊 Setting up BigTable (optional for now)..."
read -p "Create BigTable instance? This costs ~\$500/month. (y/n): " CREATE_BIGTABLE

if [ "$CREATE_BIGTABLE" = "y" ]; then
    INSTANCE_ID="autosquare-sessions"
    CLUSTER_ID="autosquare-sessions-c1"
    
    if gcloud bigtable instances describe $INSTANCE_ID &>/dev/null; then
        echo "  BigTable instance '$INSTANCE_ID' already exists"
    else
        echo "  Creating BigTable instance..."
        gcloud bigtable instances create $INSTANCE_ID \
            --display-name="AutoSquare Sessions" \
            --cluster-config=id=$CLUSTER_ID,zone=us-central1-a,nodes=1
        
        echo "  Creating table 'diagnosis_sessions'..."
        # Create table using cbt tool
        if command -v cbt &> /dev/null; then
            echo "project = $PROJECT_ID" > ~/.cbtrc
            echo "instance = $INSTANCE_ID" >> ~/.cbtrc
            cbt createtable diagnosis_sessions
            cbt createfamily diagnosis_sessions metadata
            cbt createfamily diagnosis_sessions input
            cbt createfamily diagnosis_sessions analysis
            cbt createfamily diagnosis_sessions outcome
            echo "  ✅ BigTable table created"
        else
            echo "  ⚠️  cbt tool not found. Install with: gcloud components install cbt"
            echo "  You'll need to create the table manually."
        fi
    fi
else
    echo "  Skipping BigTable setup (can be added later)"
fi

echo ""
echo "🔑 Creating Service Account for Cloud Run..."
SA_NAME="autosquare-mcp"
SA_EMAIL="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

if gcloud iam service-accounts describe $SA_EMAIL &>/dev/null; then
    echo "  Service account '$SA_NAME' already exists"
else
    gcloud iam service-accounts create $SA_NAME \
        --display-name="AutoSquare MCP Server"
    echo "  ✅ Service account created"
fi

echo ""
echo "📝 Granting IAM roles to service account..."
ROLES=(
    "roles/secretmanager.secretAccessor"
    "roles/bigtable.user"
)

for role in "${ROLES[@]}"; do
    echo "  Granting $role..."
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:$SA_EMAIL" \
        --role="$role" \
        --quiet
done

echo ""
echo "✅ GCP Setup Complete!"
echo ""
echo "Summary:"
echo "  Project:         $PROJECT_ID"
echo "  Service Account: $SA_EMAIL"
echo "  APIs Enabled:    ${#APIS[@]} APIs"
echo ""
echo "Next steps:"
echo "  1. Copy backend/.env.example to backend/.env"
echo "  2. Update GCP_PROJECT=$PROJECT_ID in backend/.env"
echo "  3. Run 'npm run dev:backend' to test the MCP server"
