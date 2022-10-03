//  Copyright (c) 2021 FlyByWire Simulations
//  SPDX-License-Identifier: GPL-3.0

import { AtsuTimestamp } from '@atsu/messages/AtsuTimestamp';
import { AtsuStatusCodes } from '@atsu/AtsuStatusCodes';
import { AtsuMessageType, AtsuMessageDirection, AtsuMessageSerializationFormat, AtsuMessage, AtsuMessageNetwork } from './AtsuMessage';

interface CmsMessage {
    // messageId: string,
    acid?: string
    aircraftType: string,
    msn: number,
    flightNumber: string,
    transmissionDate: AtsuTimestamp,
    receptionDate: AtsuTimestamp,
    rawData?: string,
    messageType: string,
    messageSubType?: string,
    faultMessages: FaultMessage[]
}

type FaultMessage = {
    eventDate: AtsuTimestamp,
    ata: string,
    text: string,
    flightPhase: number,
    source: string,
    flightNumber: string,
    tailNumber: string,
    classNumber: number,
    type: string,
    c2Afect?: boolean,
    lVarName: string,
    lVarValue: boolean,
    identifiers: string[]
}

/**
 * Defines the general freetext message format
 */
export class CmsFaultMessage extends AtsuMessage {
    constructor() {
        super();
        this.Type = AtsuMessageType.CMS;
        this.Direction = AtsuMessageDirection.Downlink;
        this.Network = AtsuMessageNetwork.FBW;
        // this could be done this way or just from the API calls themselves
        // but we need to send down to the DB automatically not
        // necessarily passing it in each time.
        // our flight data will / should always be for the current flight

        this.FlightNumber = SimVar.GetSimVarValue('ATC FLIGHT NUMBER', 'string', 'FMC');
    }

    public message: CmsMessage;

    public FlightNumber: string;

    // figure out how to get / assemble
    public getFaultMessages(): FaultMessage[] {
        // eventually make this into a DB in the api, and we
        // fetch all the faults, loop through them and get the current
        // values -- for now PoC bb
        // TODO: Make factory for this
        const faultMessage: FaultMessage = {
            eventDate: this.Timestamp,
            ata: '361100',
            text: 'BRAKES REALLY HOT',
            source: 'BMC 2',
            flightPhase: SimVar.GetSimVarValue('L:A32NX_FWC_FLIGHT_PHASE', 'number'),
            flightNumber: this.FlightNumber,
            // TODO: Make this pull from simVar
            tailNumber: 'N981W',
            type: 'MAGICAL',
            c2Afect: false,
            classNumber: 1,
            identifiers: ['1', '2'],
            lVarName: 'L:A32NX_BRAKES_HOT',
            lVarValue: SimVar.GetSimVarValue('L:A32NX_BRAKES_HOT', 'bool'),
        };

        return [faultMessage];
    }

    // start simple and build
    // TODO: error handling
    // TODO: Nx Data Store here? might have to.
    // example: SimVar.SetSimVarValue(`PAYLOAD STATION WEIGHT:${loadStation.stationIndex}`, getUserUnit(), loadStation.load);
    public static setFaultMessage(warningName: string, type: string, value: string | number | boolean) {
        console.log('INCOMING NEW FAULT', warningName, type, value);
        SimVar.SetSimVarValue(`L:${warningName}`, type, value).then(() => `CMS FAULT MESSAGE ${warningName} SET SUCCESSFULLY`);
    }

    // public getCmsMessage(): CmsMessage {
    //     return {
    //         acid: '',
    //         aircraftType: "A320",
    //         msn: 1572,
    //         flightNumber: this.FlightNumber,
    //         transmissionDate: this.Timestamp,
    //         receptionDate: this.Timestamp,
    //         rawData: "",
    //         messageType: "CMS",
    //         messageSubType: "FM",
    //         faultMessages: this.getFaultMessages()
    //     }
    // }
}
