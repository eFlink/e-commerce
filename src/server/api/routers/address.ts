import { GlobeAsiaAustraliaIcon } from "@heroicons/react/20/solid";
import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import Easypost from "@easypost/api"
import { env } from "~/env.mjs";
import fs from "fs";
import path from "path";

interface util {
    fromAddress: string;
}

export const addressRouter = createTRPCRouter({
    updateAddress: adminProcedure
    .input(z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zip: z.string()
    }))
    .mutation( async ({ctx, input}) => {
        const api = new Easypost(process.env.EASY_POST_API_KEY!);

        const address = await api.Address.createAndVerify({
            street1: input.street,
            city: input.city,
            state: input.state,
            zip: input.zip,
            country: 'AUS'
        });
        const filePath = path.join(__dirname, 'util.json');

        fs.readFile("/root/dohfigure/util.json", {encoding: "utf-8"}, (err, jsonString) => {
            if (err) {
                console.log(err)
                return;
            } 

            const data: util = JSON.parse(jsonString) as util;
            data.fromAddress = address.id;
            fs.writeFile('util.json', JSON.stringify(data, null, 4), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        });

    }),
});