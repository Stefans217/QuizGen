export const choiceInteraction = async () => {
    return `
        <itemBody>
            <choiceInteraction responseIdentifier="RESPONSE" shuffle="false" maxChoices="1">
                <prompt>*Question*</prompt>
                <simpleChoice identifier="ChoiceA">*choice 1*</simpleChoice>
                <simpleChoice identifier="ChoiceB">*choice 2*</simpleChoice>
                <simpleChoice identifier="ChoiceC">*choice 3*</simpleChoice>
            </choiceInteraction>
        </itemBody>`;
}