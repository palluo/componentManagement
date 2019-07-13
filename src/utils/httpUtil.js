import axios from 'axios'
export function getUrlKey(name) {
    return (
        decodeURIComponent(
            (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
                location.href
                // eslint-disable-next-line no-sparse-arrays
            ) || [, ""])[1].replace(/\+/g, "%20")
        ) || null
    );
};

export const getStaticConfig = (url) => {
    return (async() => {
        let {data} = await axios.get(url);
        return data
    })()
};