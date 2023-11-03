function getImageType(buffer) {
    const signature = buffer.toString('hex', 0, 8); // Lee los primeros 8 bytes en formato hexadecimal

    if (signature.startsWith('89504e47')) {
        return 'png';
    } else if (signature.startsWith('ffd8ff')) {
        return 'jpg';
    } else if (signature.startsWith('47494638')) {
        return 'gif';
    } else {
        return 'Tipo de imagen desconocido';
    }
}

module.exports = { getImageType };