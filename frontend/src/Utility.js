import toBuffer from 'blob-to-buffer';
import Utility from '../../backend/src/Utility.js';

Utility.blobToBuffer = function (read) {
    return (end, cb) => {
        read(end, (end, data) => {
            toBuffer(data, cb);
        });
    };
};

export default Utility;
