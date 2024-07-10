
export function scrollTo(id: string, top?: number): void {
    console.log('scrollTo')

    const elem = document.getElementById(id)
    if (elem) {
        setTimeout(function(){
            elem.scrollTop = elem.scrollHeight + (top ? top : 100);

            console.log(elem.scrollHeight)
        },500);
    }
}
