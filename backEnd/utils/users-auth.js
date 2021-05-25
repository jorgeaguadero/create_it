function validateProperty(req, element) {
    if (req.auth.role === 'user' && Number(req.auth.id) !== Number(element.id_user)) {
        const error = new Error('Permiso denegado');
        throw error;
    }
}

module.exports = { validateProperty };
