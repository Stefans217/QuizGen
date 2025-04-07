export const extendedTextInteraction = () => {
    return `
    <assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p2"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.imsglobal.org/xsd/imsqti_v2p2  http://www.imsglobal.org/xsd/qti/qtiv2p2/imsqti_v2p2p2.xsd"
        identifier="essay" title="*question title*" adaptive="false" timeDependent="false">
	    <responseDeclaration identifier="RESPONSE" cardinality="single" baseType="string"/>
	    <outcomeDeclaration identifier="SCORE" cardinality="single" baseType="float" externalScored="human"/>
        <itemBody>
            <p>*Enter Question Here*</p>
            <extendedTextInteraction responseIdentifier="RESPONSE" expectedLength="*enter expected length integer here*">
                <prompt><b>*Give brief instructions here*</b></prompt>
            </extendedTextInteraction>
        </itemBody>
    </assessmentItem>`;
};