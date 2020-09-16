'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mailer = require('nodemailer');

const server = express();

server.use(
	cors({
		origin: ['https://travisskyles.com', 'http://localhost:5500'],
	})
);
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.post('/sendmail', (req, res) => {
	console.log('here');
	console.log(req.body);
	const { name, email, subject, message } = req.body;
	const transporter = mailer.createTransport({
		service: 'SendinBlue',
		auth: {
			user: process.env.TRANSPORTER_USER,
			pass: process.env.TRANSPORTER_PASSWORD,
		},
	});

	const mailOptions = {
		from: email,
		to: process.env.RECIEVER_EMAIL,
		subject: `From ${name}: ${subject}`,
		text: message,
	};

	// verify connection configuration
	transporter.verify(function (error, success) {
		if (error) {
			console.log(error);
		} else {
			console.log('Server is ready to take our messages');
		}
	});

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
			res.status(500).send('Sorry, there was a issue sending your message...');
		} else {
			console.log(info);
			res.status(200).send('Message sent successfully!');
		}
	});
});

module.exports = {
	server: server,
	start: (PORT) =>
		server.listen(PORT, () => console.log(`server up on ${PORT}`)),
};
