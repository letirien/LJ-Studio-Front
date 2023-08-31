import Link from "next/link";
import Head from 'next/head';
import Layout from "../../components/layout";
import { fetcher } from '../../lib/api.Js';
export default function Project({project}){
    return (
        <>
            <Layout>
                <Head>
                    <title>{project.attributes.subject}</title>
                </Head>
                <section>
                    <p>page content page</p>
                </section>
            </Layout>
        </>

    )
}

export async function getServerSideProps({params}){
    const {slug} = params
    const projectResp = await fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/slugify/slugs/project/${slug}`)
    return {
        props: {
            project: projectResp.data
        }
    }
}   