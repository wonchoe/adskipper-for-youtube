if (window.__myExtensionFetchProxyInjected) {
    if (getAdsDebugValue())
        console.log("Fetch proxy injected");
} else {
    window.__myExtensionFetchProxyInjected = true;
    var skipAd = () => {
        return document.body?.dataset?.ads === 'true' || false;
    };

    var getAdsDebugValue = () => {
        const value = localStorage.getItem('wonchoe');
        return value === 'true' || false;
    };

    const deleteAdKeys = (obj, dest) => {
        if (obj && typeof obj === 'object') {
            ['adPlacements', 'adSlots', 'playerAds'].forEach(key => {
                if (key in obj) {
                    if (getAdsDebugValue())
                        console.log(`Removing key: ${key} from ${dest}`);
                    delete obj[key];
                }
            });
            Object.values(obj).forEach(value => {
                if (typeof value === 'object') {
                    deleteAdKeys(value);
                }
            });
        }
        return obj;
    };


    const setNewFetch = (() => {
        const newFetchFunc = function (target, thisArg, argArray) {

            if (getAdsDebugValue())
                console.log(argArray);

            if (argArray?.[0]?.method && Object.getOwnPropertyDescriptor(argArray[0], "method") === undefined) {
                return target.apply(thisArg, argArray).then(response => {
                    return response.clone().text().then(text => {
                        const adKeysPattern = /adPlacements|adSlots|playerAds/;
                        let data = JSON.parse(text.replace(")]}'\n", ""));
                        if (adKeysPattern.test(text) && skipAd()) {
                            if (getAdsDebugValue())
                                console.log(text);
                            data = deleteAdKeys(data, 'fetch replace');
                            window.ytInitialPlayerResponse = data;
                            return new Response(JSON.stringify(data), {
                                status: response.status,
                                statusText: response.statusText,
                                headers: response.headers
                            });
                        } else {
                            return response;
                        }
                    }).catch(() => response);
                });
            } else {
                return target.apply(thisArg, argArray);
            }
        };

        const originalFetch = window.fetch?.["original"] || window.fetch;
        window.fetch = new Proxy(originalFetch, {apply: newFetchFunc});
        window.fetch.original = originalFetch;
        return {};
    })();



    const defineObservableProperty = (object, propertyName, deleteAdKeys) => {
        let value = undefined;
        let processing = false;

        Object.defineProperty(object, propertyName, {
            set(data) {
                if (processing)
                    return;
                processing = true;
                if (getAdsDebugValue())
                    console.log(`Setting ${propertyName}`);
                if (getAdsDebugValue())
                    console.log(data);
                if (skipAd())
                    value = deleteAdKeys(data, propertyName);
                processing = false;
            },
            get() {
                return value;
            }
        });
    };

    defineObservableProperty(window, "ytInitialPlayerResponse", deleteAdKeys);
    defineObservableProperty(window, "ytInitialData", deleteAdKeys);
}

//y_player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
