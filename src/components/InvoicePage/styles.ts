import { CSSClasses } from '../../types/cssClasses';
import { Font } from '@react-pdf/renderer';

Font.register({
    family: 'Nunito',
    fonts: [
        {
            src: 'https://fonts.gstatic.com/s/nunito/v12/XRXV3I6Li01BKofINeaE.ttf',
        },
        {
            src: 'https://fonts.gstatic.com/s/nunito/v12/XRXW3I6Li01BKofA6sKUYevN.ttf',
            fontWeight: 600,
        },
    ],
});
Font.registerHyphenationCallback((word) => [word]);

const colorGray = '#666';
const colorLightGray = '#e3e3e3';

const styles: CSSClasses = {
    invoice_wrapper: {
        position: 'relative',
        background: '#fff',
        padding: '40px',
        boxShadow: '0 0 17px 0 rgba(16, 40, 73, 0.09)',
        fontFamily: 'Nunito',
    },
    bold: {
        fontWeight: 'bold',
    },
    'fs-small': {
        fontSize: '10px',
    },
    'fs-medium': {
        fontSize: '20px',
    },
    'fs-large': {
        fontSize: '30px',
    },
    flex: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    'align-center': {
        alignItems: 'center',
    },
    left: {
        textAlign: 'left',
    },
    right: {
        textAlign: 'right',
    },
    'mt-small': {
        marginTop: '10px',
    },
    'mt-med': {
        marginTop: '15px',
    },
    'mt-large': {
        marginTop: '20px',
    },
    35: {
        width: '35%',
    },
    50: {
        width: '50%',
    },
    bg: {
        backgroundColor: 'red',
    },
    bgr: {
        backgroundColor: 'green',
    },
    'bg-gray': {
        backgroundColor: colorGray,
        color: 'white',
    },
    'bg-light-gray': {
        backgroundColor: colorLightGray,
    },
    row: {
        borderBottom: `1px solid ${colorGray}`,
    },
    'w-8': {
        width: '8%',
    },
    'w-17': {
        width: '17%',
    },
    'w-18': {
        width: '18%',
    },
    'w-26': {
        width: '26%',
    },
    'w-35': {
        width: '35%',
    },
    'w-48': {
        width: '48%',
    },
    'p-4-8': {
        padding: '4px 8px',
    },
    'fl-small': {
        flex: 1,
    },
    'fl-med': {
        flex: 2,
    },
    'fl-large': {
        flex: 6,
    },
    image: {
        position: 'relative',
        display: 'block',
        height: '50px',
    },
};

export default styles;
