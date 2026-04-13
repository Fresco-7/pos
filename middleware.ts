import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { apiAuthPrefix, publicRoutes } from "@/routes";

import { Restaurant } from "@prisma/client";
const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

    if(nextUrl.pathname.startsWith('/verify-email/')){
        return null
    }
    if(nextUrl.pathname.startsWith('/reset-password')){
        return null
    }

    if (isApiAuthRoute) {
        return null;
    }

    if (isPublicRoute) {
        return null
    }

    if (!isLoggedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);

        return Response.redirect(new URL(
            `/?callbackUrl=${encodedCallbackUrl}`,
            nextUrl
        ));
    }

    const data = { "email": req.auth?.user.email }

    const response = await fetch(`${process.env.BASE_URL}/api/getUser`, {
        method: "POST",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (!responseData.user) {
        return Response.redirect(new URL(
            `/`,
            nextUrl
        ));
    }

    const type = getIdFromPath(nextUrl.pathname);
    if (type) {
        if (responseData.user.role === 'OWNER') {
            if (type.id === null) {
                return null
            }

            const restaurants: Restaurant[] = responseData.user.Restaurant
            const isTypeInRestaurants = restaurants.some(restaurant => restaurant.id === type.id);
            if (isTypeInRestaurants) {
                return null
            }

            return Response.redirect(new URL(
                `/`,
                nextUrl
            ));
        }

        if (responseData.user.role === 'EMPLOYEE' && type?.role === 'any') {

            if (type.id === null) {
                return null
            }

            if (responseData.user.Employee.restaurantId === type.id) {
                return null
            }

            return Response.redirect(new URL(
                `/`,
                nextUrl
            ));
        } else {
            return Response.redirect(new URL(
                `/`,
                nextUrl
            ));
        }

        return null;
    }


});


function getIdFromPath(path: string) {
    const pathSegments = path.split('/');
    if (path.startsWith('/dashboard/')) {
        if (pathSegments.length === 3) {
            return {
                role: "owner",
                id: pathSegments[2]
            }
        }
        if (path.endsWith('/employees')) {
            return {
                role: "owner",
                id: pathSegments[2]
            }
        }
        return {
            role: "any",
            id: pathSegments[2]
        }
    }

    if (path.startsWith('/settings/restaurant/')) {
        return {
            role: "owner",
            id: pathSegments[3]
        }
    }

    if (path.endsWith('/dashboard')) {
        return {
            role: "owner",
            id: null
        }
    }

    if (path === '/settings/api' || path.startsWith('/settings/restaurant')) {
        return {
            role: "owner",
            id: null
        }
    }

    if (path === '/settings/security' || '/settings/profile') {
        return {
            role: 'any',
            id: null
        }
    }

}

export const config = {
    matcher: '/((?!api|_next|static|public|favicon.ico).*)'
}