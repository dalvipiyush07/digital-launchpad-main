// Email API endpoint for contact form
// This would typically be a serverless function or API route

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  service: string;
  budget?: string;
  message?: string;
}

export async function sendContactEmails(data: ContactFormData) {
  // This is a placeholder - in production, this would be a serverless function
  // that uses Nodemailer with Gmail SMTP
  
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to send email');
  }

  return response.json();
}

// Server-side implementation (for reference - would be in a serverless function)
/*
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: Request) {
  const data: ContactFormData = await request.json();
  
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  
  // Email 1: Notification to owner
  const ownerEmail = {
    from: process.env.GMAIL_USER,
    to: process.env.NOTIFICATION_EMAIL,
    subject: `🚀 New Inquiry from ${data.name} — Cloud Build`,
    text: `Hi Shivam,

You have a new inquiry from your Cloud Build website!

━━━━━━━━━━━━━━━━━━━━━━
CONTACT DETAILS
━━━━━━━━━━━━━━━━━━━━━━
Name:     ${data.name}
Email:    ${data.email}
Phone:    ${data.phone || 'Not provided'}
City:     ${data.city || 'Not provided'}

━━━━━━━━━━━━━━━━━━━━━━
PROJECT DETAILS
━━━━━━━━━━━━━━━━━━━━━━
Service:  ${data.service}
Budget:   ${data.budget || 'Not specified'}
Message:  ${data.message || 'No message'}

━━━━━━━━━━━━━━━━━━━━━━
Submitted at: ${timestamp}
━━━━━━━━━━━━━━━━━━━━━━

Reply directly to this email or WhatsApp them quickly:
https://wa.me/message/UNJZ4N7XVUHSB1

— Cloud Build Website`,
  };

  // Email 2: Auto-reply to user
  const firstName = data.name.split(' ')[0];
  const userEmail = {
    from: process.env.GMAIL_USER,
    to: data.email,
    subject: 'We received your message — Cloud Build 🚀',
    text: `Hi ${firstName},

Thank you for visiting Cloud Build and showing interest in our services! 🙌

We have received your inquiry about ${data.service} and our team will contact you soon to discuss your business needs.

━━━━━━━━━━━━━━━━━━━━━━
WHAT HAPPENS NEXT?
━━━━━━━━━━━━━━━━━━━━━━
✅ Our team reviews your requirements
✅ We get back to you within 24 hours
✅ We discuss your project, timeline & budget
✅ We start building your dream digital product

━━━━━━━━━━━━━━━━━━━━━━
CONNECT WITH US FASTER
━━━━━━━━━━━━━━━━━━━━━━
💬 WhatsApp:  https://wa.me/message/UNJZ4N7XVUHSB1
📸 Instagram: https://www.instagram.com/cloud_build_
💼 LinkedIn:  https://www.linkedin.com/company/cloudbuild-technologies/

Let's grow your business together 🚀

Best regards,
Team Cloud Build
shivam.garud2011@gmail.com`,
  };

  try {
    await transporter.sendMail(ownerEmail);
    await transporter.sendMail(userEmail);
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return Response.json({ success: false, error: 'Failed to send emails' }, { status: 500 });
  }
}
*/
