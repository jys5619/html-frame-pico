
const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", file: "/main/main.html" },
        { path: "/page", file: "/main/main.html" },
        { path: "/template", file: "/template/template.html" },
        { path: "/main", file: "/main/main.html" },
        { path: "/user", file: "/user/user.html" },
    ];

    const findRoute = routes.find(route => location.pathname.match(pathToRegex(route.path))) || { path: "/404", file: "/404.html" };

    const matchRoute = {
        route: findRoute,
        result: [location.pathname]
    };

    // console.log('params', getParams(matchRoute));

    const res = await fetch(`/page${matchRoute.route.file}`);
    let html = await res.text();

    if (!res.ok) {
        res = await fetch('/page/404.page');
        html = await res.text();
    }

    document.querySelector("#app").innerHTML = html;
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});