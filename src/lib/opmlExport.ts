/*
  Special thanks to Steven Bell of Curiocaster who wrote the original version of this script.
  Check out his Podcasting 2.0 Certified app by visiting https://curiocaster.com
*/

import { Platform } from 'react-native'
import Share, {Options} from "react-native-share"
import RNFS from "react-native-fs"
import { getSubscribedPodcasts } from '../state/actions/podcast'

export const exportSubscribedPodcastsAsOPML = async () => {
  const subscribedPodcasts = await getSubscribedPodcasts()
  const blob = opmlExport(subscribedPodcasts)
  await downloadOPMLExport(blob)
}

const downloadOPMLExport = async (xmlData: string) => {
  const path = RNFS.TemporaryDirectoryPath + '/podversefeed.opml';
  const isAndroid = Platform.OS === 'android'
  let base64Data = null
  try{
    await RNFS.writeFile(path, xmlData, 'utf8')
    if(isAndroid) {
      base64Data = await RNFS.readFile(path, 'base64')
    }
    
    const options: Options = {
      type: "xml",
      url: isAndroid ? `data:text/xml;base64,${base64Data}` : path,
      filename: isAndroid ? "podversefeed" : undefined
    };

    await Share.open(options);
    await RNFS.unlink(path);
  }
  catch(err) {
    console.log("Error: ", err.message);
  }
}

const opmlExport = (podcastList: any) => {
  const newOpml = jsonToXML(podcastList)

  return newOpml
  
  function escapeEntities(str: string) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }
  // need to fix podcast.url below
  function jsonToXML(json: any[]) {
    return `
      <?xml version="1.0"?>
      <opml version="1.0">
        <head>
          <title>OPML exported from Podverse</title>
          <dateCreated>${new Date()}</dateCreated>
          <dateModified>${new Date()}</dateModified>
        </head>
        <body>
          ${json.map((podcast: any) =>
            `<outline text="${escapeEntities(podcast.title)}" type="rss" xmlUrl="${encodeURIComponent(podcast.url)}"/>`
          )}
        </body>
      </opml>
    `.trim()
  }
}
