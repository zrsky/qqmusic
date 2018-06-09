//添加类
export function addClass(el, className) {
		if(hasClass(el, className)) {
			return;
		}
		let newClass = el.className.split(' ');
		newClass.push(className);
		el.className = newClass.join(' ');

}
//判断是否有类

export function hasClass(el, className) {
	let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
	return reg.test(el.className);
}

//获取或者设置自定义属性的值
export function getData(el, name, val) {

		const prefix = "data-";
		name = prefix + name;
		if(val) {
			return el.setAttribute({name : val})
		}else{
			return el.getAttribute(name);
		}
}
