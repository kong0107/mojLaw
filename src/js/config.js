const config = {};

config.cdn = 'https://cdn.jsdelivr.net/gh/kong0107/mojLawSplitJSON@arranged';

if(process.env.NODE_ENV === 'production') {
    //config.cdn = 'https://raw.githubusercontent.com/kong0107/mojLawSplitJSON/arranged';
    config.basename = '/mojLaw/';

}
else {
    //config.cdn = 'http://localhost/kong0107/mojLawSplit/json_arrange';
    config.basename = '/kong0107/mojLaw/';
}

export default config;
