import FAQ from '../styles/faq.module.css'

export default function faq() {

    return(
            <div class={FAQ.container}>
                <h1 className={FAQ.h1}>FAQ</h1>
                <ol className={FAQ.ol}>
                    <li className={FAQ.li}>
                        <h5 className={FAQ.question}>1. Who is Y4si?</h5>
                        <l className={FAQ.answer}>Mixed Media NFT Creator, Collector, Founder of ARTNationX.</l>
                    </li>
                    <li className={FAQ.li}>
                        <h5 className={FAQ.question}>2. What is this website for?</h5>
                        <l className={FAQ.answer}>This website is designed to help you migrate your NFTs from the old contract to the new one.</l>
                    </li>
                    <li className={FAQ.li}>
                        <h5 className={FAQ.question}>3. Why do I need to migrate my NFTs?</h5>
                        <l className={FAQ.answer}>You need to migrate as current contracts are blocked by Opensea and other marketplaces.</l>
                    </li>
                    <li className={FAQ.li}>
                        <h5 className={FAQ.question}>4. What do I need to migrate my NFTs?</h5>
                        <l className={FAQ.answer}>To migrate your NFTs, you will need to connect your wallet that holds the NFTs you wish to migrate. After that, you will need to approve the tokens and then follow the step-by-step instructions provided on our website to complete the migration process.</l>
                    </li>
                    <li className={FAQ.li}>
                        <h5 className={FAQ.question}>5. Is the migration process safe and secure?</h5>
                        <l className={FAQ.answer}>Yes, we use industry-standard security measures to ensure your NFTs are safely migrated from the old contract to the new one.</l>
                    </li>
                </ol>
            </div>
    );

}