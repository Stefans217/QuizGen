export const choiceInteraction = () => {
    return `
    <assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p2"
	    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	    xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p2  http://www.imsglobal.org/xsd/qti/qtiv2p2/imsqti_v2p2p2.xsd"
	    identifier="choice" title="*question title*" adaptive="false" timeDependent="false">
        <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="identifier">
            <correctResponse>
                <value>*correct choice (e.g ChoiceA)*</value>
            </correctResponse>
	    </responseDeclaration>
        <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float">
            <defaultValue>
                <value>0</value>
            </defaultValue>
	    </outcomeDeclaration>
        <itemBody>
            <choiceInteraction responseIdentifier="RESPONSE" shuffle="false" maxChoices="1">
                <prompt>*Question*</prompt>
                <simpleChoice identifier="ChoiceA">*choice 1*</simpleChoice>
                <simpleChoice identifier="ChoiceB">*choice 2*</simpleChoice>
                <simpleChoice identifier="ChoiceC">*choice 3*</simpleChoice>
                <simpleChoice identifier="ChoiceD">*choice 4*</simpleChoice>
            </choiceInteraction>
        </itemBody>
        <responseProcessing
		template="http://www.imsglobal.org/question/qti_v2p2/rptemplates/match_correct"/>
    </assessmentItem>`;
}