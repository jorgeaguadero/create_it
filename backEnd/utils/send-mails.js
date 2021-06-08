const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

async function sendMail(data) {
    try {
        const msg = {
            to: data.to,
            from: process.env.SENDGRID_FROM,
            subject: data.subject,
            html: `
        <h1>Mensaje desde CreateIt</h1>

        ${data.body}
        `,
        };
        await sendgrid.send(msg);
    } catch (error) {
        console.log(error);
        throw new Error(`Èrror enviando mail`);
    }
}

module.exports = {
    sendMail,
};
