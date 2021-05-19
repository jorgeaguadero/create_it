function validateUser(req, element) {
    if (Number(req.auth.id) !== Number(element.id_user)) {
        const error = new Error('Permiso denegado');
        throw error;
    }
}

module.exports = { validateUser };
