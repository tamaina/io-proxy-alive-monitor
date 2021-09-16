import fetch from 'node-fetch';
import { setting } from './setting.js';

const date = new Date();
const iso = date.toISOString();

function post() {
    const promises = [];

    for (let i = 0; i < setting.try; i++) {
        promises.push(new Promise((res, rej) => {
            setTimeout(() => {
                console.log(`post to ${setting.host} ${(i + 1)}`);

                fetch(`https://${setting.host}/api/notes/create`, {
                    method: 'POST',
                    body: JSON.stringify({
                        i: setting.token,
                        text: `${iso} ${(i + 1)}`,
                        visibility: 'followers',
                    }),
                    headers: {
                        'User-Agent': setting.userAgent
                    },
                    credentials: 'omit',
                    cache: 'no-cache'
                })
                .then(async resp => {
                    const body = await resp.json();
                    if (resp.status === 200) res(body);
                    else rej({ status: resp.status, message: body.error });
                }, rej)
            }, i * 200)
        }))
    }

    return promises;
}

function detect() {
    const promises = [];

    for (const instance of setting.detectors) {
        console.log(`${instance.host} wait 60s`);

        promises.push(new Promise((res, rej) => {
            setTimeout(() => {
                fetch(`https://${instance.host}/api/notes/timeline`, {
                    method: 'POST',
                    body: JSON.stringify({
                        i: instance.token,
                    }),
                    headers: {
                        'User-Agent': setting.userAgent
                    },
                    credentials: 'omit',
                    cache: 'no-cache'
                })
                .then(async resp => {
                    const body = await resp.json();
                    if (resp.status === 200) {
                        const found = body.filter(note => note.text && note.text.startsWith(iso));
                        if (found.length === setting.try) return res(false);
                        else return res(instance.host)
                    }
                    else rej({ status: resp.status, message: body.error });
                })
                .catch(rej)
            }, 60000)
        }))
    }

    return promises;
}

export default async () => {
    const posts = await Promise.all(post());
    console.log(posts.map(res => res.createdNote.id))
    const results = await Promise.all(detect());
    if (results.filter(r => r === false).length !== setting.detectors.length) {
        console.log('fail')

        fetch(`https://${setting.host}/api/notes/create`, {
            method: 'POST',
            body: JSON.stringify({
                i: setting.token,
                text: `${setting.host}'s deliver is too slow! (${results.filter(r => r !== false).join(', ')})`,
                visibility: 'public',
            }),
            headers: {
                'User-Agent': setting.userAgent
            },
            credentials: 'omit',
            cache: 'no-cache'
        });
    } else { console.log('ok') }
}
