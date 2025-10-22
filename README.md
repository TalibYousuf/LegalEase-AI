# LegalEase AI - AI-Powered Legal Document Analysis

LegalEase AI is a comprehensive web-based tool for processing legal documents such as contracts, agreements, NDAs, and more. It provides instant insights, summaries, and risk analysis to help lawyers, businesses, and individuals understand complex legal documents quickly and efficiently.

## 🚀 Features

### Core Functionality
- **Document Upload**: Support for PDF, DOCX, and image files
- **AI-Powered Summarization**: Generate comprehensive document summaries with key terms, obligations, and recommendations
- **Clause Extraction**: Automatically identify and categorize important legal clauses
- **Risk Analysis**: Assess document risks with detailed breakdowns and red flag detection
- **Document Comparison**: Compare two documents side-by-side to identify differences
- **Smart Search**: Find similar clauses across your document library

### AI Capabilities
- **OpenAI Integration**: Uses GPT-4o-mini for intelligent document analysis
- **Structured Output**: Returns organized, actionable insights
- **Risk Scoring**: 0-100 risk assessment with detailed explanations
- **Plain English Explanations**: Translates legal jargon into business-friendly language

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **OpenAI API** for AI processing
- **Multer** for file uploads
- **PDF-parse** and **Mammoth** for text extraction
- **JSON file storage** (easily upgradeable to MongoDB)

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Dropzone** for file uploads

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key (optional but recommended)

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd LegalEase-AI

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

Create environment files:

**Backend (.env):**
```env
PORT=4000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:3000
UPLOADS_DIR=../uploads
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

**Frontend (.env):**
```env
REACT_APP_API_BASE=http://localhost:4000/api
REACT_APP_APP_NAME=LegalEase AI
```

### 3. Start the Application

```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend (from frontend directory, in a new terminal)
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## 📖 Usage Guide

### 1. Upload Documents
- Navigate to the Dashboard or Home page
- Drag and drop or select PDF, DOCX, or image files
- Documents are automatically processed and stored

### 2. Generate Summaries
- Go to the Summary page
- Select a document from your library
- Click "Generate Summary" for AI-powered analysis
- View executive summary, key terms, obligations, and recommendations

### 3. Analyze Risks
- Visit the Risk Analysis page
- Select a document to analyze
- Get detailed risk assessment with:
  - Overall risk level (low/medium/high)
  - Risk score (0-100)
  - Red flags and missing clauses
  - Category-wise risk breakdown
  - Actionable recommendations

### 4. Compare Documents
- Use the Comparison page
- Select two documents to compare
- View side-by-side analysis including:
  - Key differences
  - Similar clauses
  - Unique elements
  - Risk assessment
  - Recommendations

## 🔧 API Endpoints

### Documents
- `GET /api/documents` - List all documents
- `POST /api/documents/upload` - Upload a new document
- `GET /api/documents/:id` - Get document details
- `POST /api/documents/:id/summary` - Generate document summary
- `POST /api/documents/:id/extract-clauses` - Extract clauses
- `POST /api/documents/:id/analyze-risks` - Analyze document risks
- `POST /api/documents/compare` - Compare two documents

### Health Check
- `GET /api/health` - API health status

## 🎯 Key Features Explained

### AI-Powered Analysis
The system uses OpenAI's GPT models to provide intelligent analysis:
- **Document Summarization**: Creates executive summaries with key insights
- **Clause Extraction**: Identifies and categorizes important legal clauses
- **Risk Assessment**: Evaluates potential risks and red flags
- **Comparison Analysis**: Compares documents to highlight differences

### Smart Text Processing
- **PDF Parsing**: Extracts text from PDF documents
- **DOCX Processing**: Handles Microsoft Word documents
- **Image OCR**: Ready for image-based document processing
- **Fallback Mechanisms**: Works even without AI when needed

### User-Friendly Interface
- **Modern Dark Theme**: Professional, easy-on-the-eyes design
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Progress Indicators**: Real-time feedback during processing
- **Intuitive Navigation**: Easy-to-use interface for all skill levels

## 🔒 Security & Privacy

- **Local Storage**: Documents stored locally by default
- **No Data Sharing**: Your documents stay on your system
- **API Key Security**: OpenAI API keys are server-side only
- **File Validation**: Secure file upload with type checking

## 🚀 Deployment

### Development
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm start
```

### Production
```bash
# Build frontend
cd frontend && npm run build

# Start backend
cd backend && npm start
```

## 🔮 Future Enhancements

- **MongoDB Integration**: Replace JSON storage with proper database
- **User Authentication**: JWT and OAuth implementation
- **Async Processing**: Queue system for large documents
- **Advanced OCR**: Image-based document processing
- **Export Features**: PDF/Word report generation
- **Team Collaboration**: Multi-user document sharing
- **API Rate Limiting**: Production-ready API management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🎉 Acknowledgments

- OpenAI for providing the AI capabilities
- The React and Node.js communities
- All contributors and testers

---

**LegalEase AI** - Making legal documents accessible to everyone through the power of AI.
