/**
 * ajax
 * @param  {[type]} url     地址
 * @param  {[type]} method  请求类型
 * @param  {[type]} body    请求的参数
 * @param  {Object} options 扩展
 * 
 */
const HotPromise = Promise;
const ajaxFn = (loadingFn, loadedFn, othersCb, opts = {}) => {
	return (url, method, body = {}, localData, options = { noLoading: false }) => {
	// url = url.includes(`?`) ? `${url}&` : `${url}?`
		let isOk = false;
		let hasCanceled = false;
		HotPromise.prototype.cancel = () => {
			hasCanceled = true;
		};
		const { noLoading } = options;
		// !noLoading && Toast.loading(null, 0);
		const request = new HotPromise((resolve, reject) => {
			const params = {
				method,
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				},
				body: Object.keys(body).length == 0 ? undefined : body
			};
			fetch(url, params)
				.then((response) => {
				// !noLoading && Toast.hide();
					response.ok ? (isOk = true) : (isOk = false);
					return response.json();
				})
				.then((responseData) => {
					if (isOk) {
						return responseData;
					} else {
						reject(responseData);
					}
				})
				.then((responseData) => {
					switch (responseData.status) {
						case 1:
							resolve(responseData);
							break;
						case 0:
							reject(responseData);
							break;
						default :
							reject({
								msg: "数据格式不对"
							});
							break;
					}
				})
				.catch((error) => {
					console.log(hasCanceled);
					// !noLoading && Toast.hide();
					console.log(error, __DEV__);
					reject({
						msg: `返回非200${__DEV__ ? `，尝试开启模拟数据` : ``}`
					});
				});
		});
		return request;
	};
};

export const net = {
	ajaxFn,
	ajax: ajaxFn()
};