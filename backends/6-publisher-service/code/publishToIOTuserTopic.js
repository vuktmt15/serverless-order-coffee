/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

const { IoTDataPlane } = require('@aws-sdk/client-iot-data-plane');

const iotdata = new IoTDataPlane({
  endpoint: "https://" + process.env.IOT_DATA_ENDPOINT,
  region: process.env.AWS_REGION
})

// Publishes the message to the IoT topic
const iotPublish = async function (baseTopic, event) {
  const topic = `${baseTopic}${event.detail.userId}`

  try {
    const params = {
      topic,
      qos: 1,
      payload: JSON.stringify({
        type: event['detail-type'],
        detail: event.detail
      })
    }
    console.log('Params: ', params)
    const result = await iotdata.publish(params)
    console.log('iotPublish successful: ', topic, result)
  } catch (err) {
    console.error('iotPublish error:', err)
  }
}

exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))
  await iotPublish(process.env.IOT_TOPIC, event)
}
