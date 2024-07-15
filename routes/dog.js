const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const axios  = require('axios');

const response_codes = [100, 101, 102, 103, 200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 300, 301, 302, 303, 304, 305, 306, 307, 308, 
    400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429, 431, 451, 
    500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511];

const getRegexFromPattern = (pattern) => {
    // Replace `x` with `\d` to match any digit
    const regexPattern = pattern.replace(/x/g, '\\d');
    return new RegExp(`^${regexPattern}`);
};
  

router.get('/:code', async (req, res) => {
    const { code } = req.params;
    if(!code.includes("xx") && !code.includes("x")){
        console.log('number');
        const response = await axios.get(`https://http.dog/${code}.json`);
        res.send([{
            "code": code,
            "imageUrl": response.data['image']['jpg']
        }]);
    }else{
        let code_data = [];
        let code_regex = getRegexFromPattern(code);
        const filteredCodes = response_codes.filter(code => code_regex.test(code));
        const promises = filteredCodes.map(async (codes) => {
            try {
              const response = await axios.get(`https://http.dog/${codes}.json`);
              return { code: codes, imageUrl: response.data.image.jpg }; 
            } catch (err) {
              console.error(`Error fetching code ${codes}:`, err);
              return { code: codes, imageUrl: null };
            }
        });

        const results = await Promise.all(promises);
        code_data.push(...results);

        res.send(code_data);
    }
})

module.exports = router;