import React, { useEffect } from 'react';
import { Acms } from '@patrickisgreat/fbw-api-client-fork';
import { useFailuresOrchestrator } from './failures-orchestrator-provider'; // Assuming this is the path to your provider
import { getIdentifier } from './failures-map'; // Assuming these are the paths to your Acms functions
import { AtsuMessageComStatus } from '../../../../../../fbw-common/src/systems/datalink/common/src/messages/AtsuMessage';
import { AtsuStatusCodes } from '../../../../../../fbw-common/src/systems/datalink/common/src/AtsuStatusCodes';

const BeefSupremeApiConnector = () => {
    const context = useFailuresOrchestrator();

    useEffect(() => {
        const interval = setInterval(async () => {
            await receiveAcmsFaultMessage(context);
        }, 3000);

        return () => {
            clearInterval(interval);
        };
    }, [context]);

    return null;
};

async function receiveAcmsFaultMessage(context): Promise<AtsuStatusCodes> {
    const { activate } = context;
    return Acms.getOneAcmsMessage('KFG123', 'N981W', 'New', 'Uplink').then((data) => {
        data.ComStatus = 'Received';
        const failureIdentifier = getIdentifier(data.faultMessages[0].text);
        activate(failureIdentifier);
        Acms.createAcmsMessage(data).then(() => AtsuStatusCodes.Ok);
        return AtsuStatusCodes.Ok;
    }).catch((data) => {
        data.ComStatus = AtsuMessageComStatus.Failed;
        return AtsuStatusCodes.ComFailed;
    });
}

export default BeefSupremeApiConnector;
