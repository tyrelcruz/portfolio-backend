# Backend Portfolio Deployment Guide

This guide will help you deploy your backend portfolio project on Render.

## Prerequisites

1. **GitHub Account**: Your code should be pushed to a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas Account**: For database hosting
4. **Google Cloud Account**: For Gemini API access

## Step 1: Prepare Your Repository

### 1.1 Environment Variables
Create a `.env` file in your project root with the following variables:

```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=https://your-frontend-domain.com
```

### 1.2 Update CORS Configuration
The CORS configuration has been updated to use environment variables for production.

### 1.3 Package.json Configuration
The package.json has been updated with:
- Proper Node.js engine requirements
- Correct main entry point
- Production-ready scripts

## Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Whitelist all IP addresses (0.0.0.0/0) for Render deployment
5. Get your connection string and update your `.env` file

## Step 3: Set Up Google Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add the API key to your `.env` file

## Step 4: Deploy to Render

### 4.1 Connect GitHub Repository

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select your repository
5. Choose the branch (usually `main` or `master`)

### 4.2 Configure Build Settings

Render will auto-detect your Node.js project. The configuration should be:

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 18.x (or latest LTS)

### 4.3 Environment Variables

In the Render dashboard, go to your service → Environment tab and add:

```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=https://your-frontend-domain.com
```

### 4.4 Advanced Settings

- **Health Check Path**: `/api/health`
- **Auto-Deploy**: Enable for automatic deployments on git push

## Step 5: Test Your Deployment

1. Wait for the build to complete (usually 2-5 minutes)
2. Check the logs for any errors
3. Visit your service URL + `/api/health` to verify it's working
4. Test your API endpoints

## Step 6: Custom Domain (Optional)

1. In your Render service settings, go to "Custom Domains"
2. Add your domain
3. Update your DNS records as instructed
4. Update the `FRONTEND_URL` environment variable

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check Node.js version compatibility
   - Ensure all dependencies are in `package.json`
   - Check build logs for specific errors

2. **Database Connection Issues**:
   - Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
   - Check connection string format
   - Ensure database user has proper permissions

3. **CORS Issues**:
   - Update `FRONTEND_URL` environment variable
   - Check that your frontend domain is correctly configured

4. **API Key Issues**:
   - Verify Gemini API key is correct
   - Check API quotas and billing

### Useful Commands:

```bash
# Test locally with production environment
NODE_ENV=production npm start

# Check if all dependencies are installed
npm install

# Run health check
curl https://your-render-url.onrender.com/api/health
```

## Monitoring and Maintenance

1. **Logs**: Check Render dashboard for application logs
2. **Metrics**: Monitor CPU, memory, and response times
3. **Updates**: Push to your repository to trigger automatic deployments
4. **Backups**: MongoDB Atlas provides automatic backups

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Use environment variables for all sensitive data
3. **CORS**: Configure CORS properly for production
4. **HTTPS**: Render provides HTTPS by default
5. **Database**: Use strong passwords and proper user permissions

## Cost Optimization

- **Free Tier**: Render offers a free tier with limitations
- **Database**: MongoDB Atlas has a free tier
- **API Usage**: Monitor Gemini API usage to avoid unexpected charges

## Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **MongoDB Atlas Documentation**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Google AI Documentation**: [ai.google.dev](https://ai.google.dev)

---

Your backend should now be successfully deployed on Render! 🚀
