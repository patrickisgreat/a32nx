connectToNetworks is what the plane actually calls

[connectToNetworks](./src/ATSU.ts)

an example:
C:\Users\patri\code\a32nx\flybywire-aircraft-a320-neo\html_ui\Pages\VCockpit\Instruments\Airliners\FlyByWire_A320_Neo\FMC\A32NX_FMCMainDisplay.js



public async sendMessage bookmark is where atsu messages are sent


either use elements file to store list of faults / LVars similar to CpdlcMessageElements.ts, OR store in DB in api and fetch. Need to think more on this


const code = await Datalink.connect(flightNo); in ATSU.ts -- may need to update here the connection

Flight State Observer -- maybe the best place to put a watcher that constantly listens for any failures
