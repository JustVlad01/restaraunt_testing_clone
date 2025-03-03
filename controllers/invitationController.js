const Invitation = require('../models/invitation');
const nodemailer = require('nodemailer');

exports.createInvitation = async (req, res) => {
    try {
        const { email } = req.body;

        //Creating transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Make sure restaurantId exists in req.user
        const restaurantId = req.user.restaurantId;
        if (!restaurantId) {
            return res.status(400).json({ msg: 'Restaurant ID is required.' });
        }

        // Create a new invitation with a unique code and associated restaurant
        const invitation = new Invitation({ email, restaurantId });

        await invitation.save();

        // Generate the invitation url
        const invitationUrl = `${process.env.ADMIN_FRONTEND_URL}/?code=${invitation.uniqueCode}`;

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'You are invited to join our restaurant!',
            text: 'Here is the invitation link: ' + invitationUrl,
        };

        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).json({ error: 'Failed to send email' });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(201).json({
                    message: 'Invitation created successfully',
                });
            }
        });
    } catch (error) {
        console.error('Error creating invitation:', error);
        res.status(500).json({ error: 'Failed to create invitation' });
    }
};
