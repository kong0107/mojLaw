const config = {};

if(process.env.NODE_ENV === 'production') {
    config.basename = '/mojLaw/';
}
else {
    config.basename = '/kong0107/mojLaw/';
}

export default config;
