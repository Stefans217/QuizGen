export const extendedTextInteraction = async () => {
    return `
        <itemBody>
                <p>*Enter Question Here*</p>
            <extendedTextInteraction responseIdentifier="RESPONSE" expectedLength="*enter expected length integer here*">
                <prompt><b>*Give brief instructions here*</b></prompt>
            </extendedTextInteraction>
        </itemBody>`;
};