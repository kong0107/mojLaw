const config = {};

if(process.env.NODE_ENV === 'production') {
    config.cdn = 'https://raw.githubusercontent.com/kong0107/mojLawSplitJSON/arranged';
    config.basename = '/mojLaw/';

}
else {
    config.cdn = 'http://localhost/kong0107/mojLawSplit/json_arrange';
    config.basename = '/kong0107/mojLaw/';
}
/*-{
    cdn: (process.env.NODE_ENV === 'production')
    ? 'https://raw.githubusercontent.com/kong0107/mojLawSplitJSON/arranged'
    : 'http://localhost/kong0107/mojLawSplit/json_arrange'
};*/

export default config;
