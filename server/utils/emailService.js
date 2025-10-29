import nodemailer from "nodemailer";
import logger from "../config/logger.js";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: `"JobCortex" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            ...(html && { html }),
        };

        await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully to ${to} with subject: ${subject}`);
    } catch (error) {
        logger.error(`Failed to send email to ${to}:`, error);
        throw error;
    }
};

// Email template for application acceptance
export const sendApplicationAcceptedEmail = async (candidateEmail, candidateName, jobTitle, companyName, interviewDetails = null) => {
    const subject = `🎉 Congratulations! Your application for ${jobTitle} at ${companyName} has been accepted`;

    const text = `
Dear ${candidateName},

Congratulations! We are pleased to inform you that your application for the position of ${jobTitle} at ${companyName} has been accepted.

We were impressed by your qualifications and believe you would be a great fit for our team.

${
    interviewDetails
        ? `Next Steps:
${interviewDetails}`
        : "Our HR team will contact you soon with the next steps in the hiring process."
}

We look forward to welcoming you to our team!

Best regards,
${companyName} Hiring Team
JobCortex Platform
    `;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { background: #e8f5e8; padding: 15px; border-left: 4px solid #4caf50; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Congratulations!</h1>
                <p>Your application has been accepted</p>
            </div>
            <div class="content">
                <h2>Dear ${candidateName},</h2>
                <p>We are thrilled to inform you that your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been <strong style="color: #4caf50;">ACCEPTED</strong>!</p>
                
                <div class="highlight">
                    <p><strong>We were impressed by your qualifications and believe you would be a great fit for our team.</strong></p>
                </div>

                ${
                    interviewDetails
                        ? `
                <h3>📅 Next Steps:</h3>
                <p>${interviewDetails.replace(/\n/g, "<br>")}</p>
                `
                        : `
                <h3>📞 What's Next?</h3>
                <p>Our HR team will contact you soon with the next steps in the hiring process, including interview scheduling and onboarding information.</p>
                `
                }

                <p>We look forward to welcoming you to our team and are excited about the potential contributions you'll make to ${companyName}.</p>
                
                <p>Best regards,<br>
                <strong>${companyName} Hiring Team</strong><br>
                JobCortex Platform</p>
            </div>
            <div class="footer">
                <p>This email was sent through JobCortex - Your AI-Powered Career Platform</p>
            </div>
        </div>
    </body>
    </html>
    `;

    await sendEmail(candidateEmail, subject, text, html);
};

// Email template for application rejection
export const sendApplicationRejectedEmail = async (candidateEmail, candidateName, jobTitle, companyName, feedback = null) => {
    const subject = `Update on your application for ${jobTitle} at ${companyName}`;

    const text = `
Dear ${candidateName},

Thank you for your interest in the ${jobTitle} position at ${companyName} and for taking the time to apply.

After careful consideration, we have decided to move forward with other candidates whose experience more closely matches our current needs for this specific role.

${
    feedback
        ? `Feedback:
${feedback}`
        : ""
}

We want to emphasize that this decision does not reflect your qualifications or potential. We encourage you to continue exploring opportunities with us and apply for future positions that match your skills and interests.

We appreciate the time and effort you invested in your application and wish you the very best in your job search.

Thank you again for considering ${companyName} as a potential employer.

Best regards,
${companyName} Hiring Team
JobCortex Platform
    `;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .highlight { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .encouragement { background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Application Update</h1>
                <p>Thank you for your interest in ${companyName}</p>
            </div>
            <div class="content">
                <h2>Dear ${candidateName},</h2>
                <p>Thank you for your interest in the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> and for taking the time to apply.</p>
                
                <p>After careful consideration, we have decided to move forward with other candidates whose experience more closely matches our current needs for this specific role.</p>

                ${
                    feedback
                        ? `
                <div class="highlight">
                    <h3>💭 Feedback:</h3>
                    <p>${feedback.replace(/\n/g, "<br>")}</p>
                </div>
                `
                        : ""
                }

                <div class="encouragement">
                    <p><strong>We want to emphasize that this decision does not reflect your qualifications or potential.</strong> We encourage you to continue exploring opportunities with us and apply for future positions that match your skills and interests.</p>
                </div>

                <p>We appreciate the time and effort you invested in your application and wish you the very best in your job search. Thank you again for considering ${companyName} as a potential employer.</p>
                
                <p>Best regards,<br>
                <strong>${companyName} Hiring Team</strong><br>
                JobCortex Platform</p>
            </div>
            <div class="footer">
                <p>This email was sent through JobCortex - Your AI-Powered Career Platform</p>
                <p>Keep exploring opportunities and growing your career with us!</p>
            </div>
        </div>
    </body>
    </html>
    `;

    await sendEmail(candidateEmail, subject, text, html);
};

// Schedule email with delay
export const scheduleApplicationStatusEmail = (candidateEmail, candidateName, jobTitle, companyName, status, details = null, delayMs = 30000) => {
    setTimeout(async () => {
        try {
            if (status === "accepted") {
                await sendApplicationAcceptedEmail(candidateEmail, candidateName, jobTitle, companyName, details);
            } else if (status === "rejected") {
                await sendApplicationRejectedEmail(candidateEmail, candidateName, jobTitle, companyName, details);
            }
            logger.info(`Delayed email sent after ${delayMs}ms for ${status} status to ${candidateEmail}`);
        } catch (error) {
            logger.error(`Failed to send delayed email to ${candidateEmail}:`, error);
        }
    }, delayMs);
};
