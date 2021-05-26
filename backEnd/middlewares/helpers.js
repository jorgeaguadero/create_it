//TODO gestionar imagenes y mail
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const { nanoid } = require('nanoid');
