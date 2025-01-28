import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import csv from 'csv-parser'


interface MyCsvRow {
    [key: string]: string;
}

export async function GET() {
    try {
        const csvFilePath = path.join(process.cwd(), 'fichier_modifie.csv')

        const results: MyCsvRow[] = []

        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(csvFilePath)
                .pipe(csv())
                .on('data', (row: MyCsvRow) => {
                    results.push(row)
                })
                .on('end', () => {
                    resolve()
                })
                .on('error', (error) => {
                    reject(error)
                })
        })

        return NextResponse.json(results, { status: 200 })
    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}