import Link from "next/link";
import React, { useState } from "react";

const menus = process.env.menu as unknown as { link: string, name: string, children: { name: string, link: string }[] }[]

const BattleNavigation = () => {
    const [opened, setOpened] = useState<string>("")
    return (
        <aside className="flex-shrink-0 w-64 overflow-auto" aria-label="Sidebar">
            <div className="h-full overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800">
                <ul className="space-y-2">
                    <li>
                        <a
                            href="/"
                            className="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                        >Home</a>
                    </li>
                    {menus.map((battle) => {
                        const collapseClass = opened === battle.name ? "visible" : "hidden"
                        return <li key={battle.name}>
                            <button
                                type="button"
                                className="flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                onClick={() => { setOpened((prevState: string) => prevState === battle.name ? "" : battle.name) }}
                            >
                                <span className="flex-1 ml-3 text-left whitespace-nowrap">{battle.name}</span>
                            </button>
                            <ul className={`py-2 space-y-2 ${collapseClass}`}>
                                {battle.children.map((item) => {
                                    const link = `/battles/${battle.link}/${item.name}`
                                    return <li key={link}><Link href={`/battles/[type]/[slug]`} as={link}>
                                        <a className="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                            {item.name}
                                        </a>
                                    </Link></li>
                                })}
                            </ul>
                        </li>
                    })}
                </ul>
            </div>
        </aside>
    );
}

export default BattleNavigation