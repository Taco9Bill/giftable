
const checkPreferences = (item, variantId, recipient) => {

    const {liked, reason} = recipient.checkGift(item, variantId);
    return {
        who: recipient,
        liked: liked,
        reason: reason
    };
}

const makeJudgements = (item, recipient) => {
    let judgements = new Map();
    const variantIds = Array.from(item.variants.keys());
    for(const vId of variantIds){
        const judged = checkPreferences(item, vId, recipient);
        judgements.set(vId, judged);
    }
}
/*
            let judgements = new Map();
            const variantIds = Array.from(item.variants.keys());
            for(const vId of variantIds){
                judgements.set(vId, recipients.map( recipient => {
                    checkPreferences(item, vId, recipient);
                }).filter( result => result.liked ));
            }
*/
