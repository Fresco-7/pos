import { Button } from "@/components/ui/button"
import Link from "next/link"

const config = [
    {
        url: "/menus/restaurantId?apiKey=apiKey",
        method: "GET",
        description: "Get a list of menus",
    },
    {
        url: "/menu/restaurantId/menuId?apiKey=apiKey",
        method: "GET",
        description: "Get a menu by id",
    },
    {
        url: "/menu/restaurantId/menuId?apiKey=apiKey",
        method: "GET",
        description: "Get a menu by id",
    },
    {
        url: "/products/restaurantId?apiKey=apiKey",
        method: "GET",
        description: "Get a list of products",
    },
    {
        url: "/product/restaurantId/produtctId?apiKey=apiKey",
        method: "GET",
        description: "Get a product by id",
    },
]

const ApiDocs = () => {
    return (
        <div>
            <>
                <div className="flex flex-col min-h-screen lg:py-10" >
                    <div className="grid gap-4">
                        <div className="space-y-4" id="introduction">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold tracking-tight">Introduction</h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Welcome to the API documentation for the POS Kitchen API. This API allows you to access and manage your
                                    POS Kitchen account programmatically.
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4" id="authentication">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold tracking-tight">Authentication</h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    All requests to the POS Kitchen API require authentication. You need to include your API key in the {" "}
                                    <code className="text-sm">query-params</code>.
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4" id="endpoints">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold tracking-tight">Endpoints</h2>
                                <p className="text-gray-500 dark:text-gray-400">
                                    The following endpoints are available in the POS Kitchen API:
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4" id="list-projects">
                            {config.map((c) => (
                                <div className="border rounded-lg overflow-hidden">
                                <div className="flex items-center justify-between p-4 border-b bg-gray-50 dark:bg-gray-950">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">{c.method} {c.url}</span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">- {c.description}</span>
                                    </div>
                                    <Link target="_blacnk" href='http://192.168.1.165:8080/menus/restaruantId?apiKey=1'>
                                        <Button size="sm">Try It Out</Button>
                                    </Link>
                                </div>
                                <div className="p-4">
                                    <div className="grid gap-1.5">
                                        <div className="grid grid-cols-[100px_1fr]">
                                            <div className="font-bold">Response</div>
                                            <div className="grid gap-0.5">
                                                <div className="font-mono">
                                                    <pre className="m-0">200 OK</pre>
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Successful request</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ))}
                            
                        </div>
                    </div>
                </div>
            </>
        </div>
    )
}
export default ApiDocs