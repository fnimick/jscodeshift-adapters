import adapt from "../../../src/index.js";

export default adapt((fileInfo, api, options) => {
	return `
const foo = 'bar';
`;
});
