'use client';
// import Papa from "papaparse";
import { useState } from "react";

export default function Home() {
  const [rows, setRows] = useState([{ input1: "", input2: "", input3: "" }]);    

    const [parameters, setParameters] = useState({
      parameterName: "",
      parameterUnits: "",
      parameterRegisterType: "", // MB_PARAM_INPUT vs MB_PARAM_HOLDING
      parameterRegAddress: "", // register address
      parameterRegSize: "",
      parameterOffset: "", // INPUT_OFFSET(input_data0) vs HOLD_OFFSET(input_data0)
      parameterDataType: "", // PARAM_TYPE_FLOAT vs PARAM_TYPE_U8 vs PARAM_TYPE_U16
      parameterDataSize: "",
      parameterOPTS: "", // OPTS( -10, 10, 1 )
    });

  const handleChange = (e, index) => {
    const { name, value } = e.target;//Name is input1, input2, or input3. Value is the value of the input box
    const updatedRows = rows.map((row, i) => 
      i === index ? { ...row, [name]: value } : row
    );
    setRows(updatedRows);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((row, i) => i !== index);
    setRows(updatedRows);
  }

  const handleAddRow = () => {
    setRows([...rows, { input1: "", input2: "", input3: "" }]);
  };

  const inputsToParameters = (input1, input2, input3) => {
    
  };
  
    // Master C file generated
    // Input 1: ${inputs.input1}
    // Input 2: ${inputs.input2}
    // Input 3: ${inputs.input3}
  const handleDownload = () => {
    const newParameters = rows.map(row => ({
      parameterName: `ParamName_${row.input1}`,
      parameterUnits: "Volts",
      parameterRegisterType: row.input2 === "3" ? "MB_PARAM_HOLDING" : "MB_PARAM_INPUT", //MB_PARAM_INPUT vs MB_PARAM_HOLDING vs...
      parameterRegAddress: row.input1,  //register address
      parameterRegSize: 2,
      parameterOffset: row.input2 === "3" ? "HOLD_OFFSET(input_data0)" : "INPUT_OFFSET(input_data0)", //INPUT_OFFSET(input_data0) vs HOLD_OFFSET(input_data0)
      parameterDataType: "PARAM_TYPE_FLOAT", //PARAM_TYPE_FLOAT vs PARAM_TYPE_U8 vs PARAM_TYPE_U16
      parameterDataSize: 4,
      parameterOPTS: "OPTS(-10, 10, 1)", //OPTS( -10, 10, 1 )
    }));

    const parametersContent = newParameters.map(param => `
    { CID_INP_DATA_0, STR("${param.parameterName}"), STR(${param.parameterUnits}), MB_DEVICE_ADDR1, ${param.parameterRegisterType},
    ${param.parameterRegAddress}, ${param.parameterRegSize}, ${param.parameterOffset}, ${param.parameterDataType},
    ${param.parameterDataSize}, ${param.parameterOPTS}, PAR_PERMS_READ_WRITE_TRIGGER }
  `).join(',\n');

  const content = `
  /*
    * SPDX-FileCopyrightText: 2016-2023 Espressif Systems (Shanghai) CO LTD
    *
    * SPDX-License-Identifier: Apache-2.0
    */
   
   #include "string.h"
   #include "esp_log.h"
   #include "modbus_params.h"  // for modbus parameters structures
   #include "mbcontroller.h"
   #include "sdkconfig.h"
   
   #define MB_PORT_NUM     (CONFIG_MB_UART_PORT_NUM)   // Number of UART port used for Modbus connection
   #define MB_DEV_SPEED    (CONFIG_MB_UART_BAUD_RATE)  // The communication speed of the UART
   
   // Note: Some pins on target chip cannot be assigned for UART communication.
   // See UART documentation for selected board and target to configure pins using Kconfig.
   
   // The number of parameters that intended to be used in the particular control process
   #define MASTER_MAX_CIDS num_device_parameters
   
   // Number of reading of parameters from slave
   #define MASTER_MAX_RETRY 30
   
   // Timeout to update cid over Modbus
   #define UPDATE_CIDS_TIMEOUT_MS          (500)
   #define UPDATE_CIDS_TIMEOUT_TICS        (UPDATE_CIDS_TIMEOUT_MS / portTICK_PERIOD_MS)
   
   // Timeout between polls
   #define POLL_TIMEOUT_MS                 (1)
   #define POLL_TIMEOUT_TICS               (POLL_TIMEOUT_MS / portTICK_PERIOD_MS)
   
   // The macro to get offset for parameter in the appropriate structure
   #define HOLD_OFFSET(field) ((uint16_t)(offsetof(holding_reg_params_t, field) + 1))
   #define INPUT_OFFSET(field) ((uint16_t)(offsetof(input_reg_params_t, field) + 1))
   #define COIL_OFFSET(field) ((uint16_t)(offsetof(coil_reg_params_t, field) + 1))
   // Discrete offset macro
   #define DISCR_OFFSET(field) ((uint16_t)(offsetof(discrete_reg_params_t, field) + 1))
   
   #define STR(fieldname) ((const char*)( fieldname ))
   // Options can be used as bit masks or parameter limits
   #define OPTS(min_val, max_val, step_val) { .opt1 = min_val, .opt2 = max_val, .opt3 = step_val }
   
   static const char *TAG = "MASTER_TEST";
   
   // Enumeration of modbus device addresses accessed by master device
   enum {
       MB_DEVICE_ADDR1 = 1 // Only one slave device used for the test (add other slave addresses here)
   };
   
   // Enumeration of all supported CIDs for device (used in parameter definition table)
   enum {
       CID_INP_DATA_0 = 0,
       CID_HOLD_DATA_0,
       CID_INP_DATA_1,
       CID_HOLD_DATA_1,
       CID_INP_DATA_2,
       CID_HOLD_DATA_2,
       CID_HOLD_TEST_REG,
       CID_RELAY_P1,
       CID_RELAY_P2,
       CID_DISCR_P1,
       CID_COUNT
   };
   
   // Example Data (Object) Dictionary for Modbus parameters:
   // The CID field in the table must be unique.
   // Modbus Slave Addr field defines slave address of the device with correspond parameter.
   // Modbus Reg Type - Type of Modbus register area (Holding register, Input Register and such).
   // Reg Start field defines the start Modbus register number and Reg Size defines the number of registers for the characteristic accordingly.
   // The Instance Offset defines offset in the appropriate parameter structure that will be used as instance to save parameter value.
   // Data Type, Data Size specify type of the characteristic and its data size.
   // Parameter Options field specifies the options that can be used to process parameter value (limits or masks).
   // Access Mode - can be used to implement custom options for processing of characteristic (Read/Write restrictions, factory mode values and etc).
   const mb_parameter_descriptor_t device_parameters[] = {
       // { CID, Param Name, Units, Modbus Slave Addr, Modbus Reg Type, Reg Start, Reg Size, Instance Offset, Data Type, Data Size, Parameter Options, Access Mode}
       ${parametersContent}
   };
   
   // Calculate number of parameters in the table
   const uint16_t num_device_parameters = (sizeof(device_parameters)/sizeof(device_parameters[0]));
   
   // The function to get pointer to parameter storage (instance) according to parameter description table
   static void* master_get_param_data(const mb_parameter_descriptor_t* param_descriptor)
   {
       assert(param_descriptor != NULL);
       void* instance_ptr = NULL;
       if (param_descriptor->param_offset != 0) {
          switch(param_descriptor->mb_param_type)
          {
              case MB_PARAM_HOLDING:
                  instance_ptr = ((void*)&holding_reg_params + param_descriptor->param_offset - 1);
                  break;
              case MB_PARAM_INPUT:
                  instance_ptr = ((void*)&input_reg_params + param_descriptor->param_offset - 1);
                  break;
              case MB_PARAM_COIL:
                  instance_ptr = ((void*)&coil_reg_params + param_descriptor->param_offset - 1);
                  break;
              case MB_PARAM_DISCRETE:
                  instance_ptr = ((void*)&discrete_reg_params + param_descriptor->param_offset - 1);
                  break;
              default:
                  instance_ptr = NULL;
                  break;
          }
       } else {
           ESP_LOGE(TAG, "Wrong parameter offset for CID #%u", (unsigned)param_descriptor->cid);
           assert(instance_ptr != NULL);
       }
       return instance_ptr;
   }
   
   // User operation function to read slave values and check alarm
   static void master_operation_func(void *arg)
   {
       esp_err_t err = ESP_OK;
       float value = 0;
       bool alarm_state = false;
       const mb_parameter_descriptor_t* param_descriptor = NULL;
   
       ESP_LOGI(TAG, "Start modbus test...");
   
       for(uint16_t retry = 0; retry <= MASTER_MAX_RETRY && (!alarm_state); retry++) {
           // Read all found characteristics from slave(s)
           for (uint16_t cid = 0; (err != ESP_ERR_NOT_FOUND) && cid < MASTER_MAX_CIDS; cid++)
           {
               // Get data from parameters description table
               // and use this information to fill the characteristics description table
               // and having all required fields in just one table
               err = mbc_master_get_cid_info(cid, &param_descriptor);
               if ((err != ESP_ERR_NOT_FOUND) && (param_descriptor != NULL)) {
                   void* temp_data_ptr = master_get_param_data(param_descriptor);
                   assert(temp_data_ptr);
                   uint8_t type = 0;
                   if ((param_descriptor->param_type == PARAM_TYPE_ASCII) &&
                           (param_descriptor->cid == CID_HOLD_TEST_REG)) {
                      // Check for long array of registers of type PARAM_TYPE_ASCII
                       err = mbc_master_get_parameter(cid, (char*)param_descriptor->param_key,
                                                       (uint8_t*)temp_data_ptr, &type);
                       if (err == ESP_OK) {
                           ESP_LOGI(TAG, "Characteristic #%u %s (%s) value = (0x%" PRIx32 ") read successful.",
                                           param_descriptor->cid,
                                           param_descriptor->param_key,
                                           param_descriptor->param_units,
                                           *(uint32_t*)temp_data_ptr);
                           // Initialize data of test array and write to slave
                           if (*(uint32_t*)temp_data_ptr != 0xAAAAAAAA) {
                               memset((void*)temp_data_ptr, 0xAA, param_descriptor->param_size);
                               *(uint32_t*)temp_data_ptr = 0xAAAAAAAA;
                               err = mbc_master_set_parameter(cid, (char*)param_descriptor->param_key,
                                                                 (uint8_t*)temp_data_ptr, &type);
                               if (err == ESP_OK) {
                                   ESP_LOGI(TAG, "Characteristic #%u %s (%s) value = (0x%" PRIx32 "), write successful.",
                                                   param_descriptor->cid,
                                                   param_descriptor->param_key,
                                                   param_descriptor->param_units,
                                                   *(uint32_t*)temp_data_ptr);
                               } else {
                                   ESP_LOGE(TAG, "Characteristic #%u (%s) write fail, err = 0x%x (%s).",
                                                   param_descriptor->cid,
                                                   param_descriptor->param_key,
                                                   (int)err,
                                                   (char*)esp_err_to_name(err));
                               }
                           }
                       } else {
                           ESP_LOGE(TAG, "Characteristic #%u (%s) read fail, err = 0x%x (%s).",
                                           param_descriptor->cid,
                                           param_descriptor->param_key,
                                           (int)err,
                                           (char*)esp_err_to_name(err));
                       }
                   } else {
                       err = mbc_master_get_parameter(cid, (char*)param_descriptor->param_key,
                                                           (uint8_t*)temp_data_ptr, &type);
                       if (err == ESP_OK) {
                           if ((param_descriptor->mb_param_type == MB_PARAM_HOLDING) ||
                               (param_descriptor->mb_param_type == MB_PARAM_INPUT)) {
                               value = *(float*)temp_data_ptr;
                               ESP_LOGI(TAG, "Characteristic #%u %s (%s) value = %f (0x%" PRIx32 ") read successful.",
                                               param_descriptor->cid,
                                               param_descriptor->param_key,
                                               param_descriptor->param_units,
                                               value,
                                               *(uint32_t*)temp_data_ptr);
                               if (((value > param_descriptor->param_opts.max) ||
                                   (value < param_descriptor->param_opts.min))) {
                                       alarm_state = true;
                                       break;
                               }
                           } else {
                               uint8_t state = *(uint8_t*)temp_data_ptr;
                               const char* rw_str = (state & param_descriptor->param_opts.opt1) ? "ON" : "OFF";
                               if ((state & param_descriptor->param_opts.opt2) == param_descriptor->param_opts.opt2) {
                                   ESP_LOGI(TAG, "Characteristic #%u %s (%s) value = %s (0x%" PRIx8 ") read successful.",
                                                   param_descriptor->cid,
                                                   param_descriptor->param_key,
                                                   param_descriptor->param_units,
                                                   (const char*)rw_str,
                                                   *(uint8_t*)temp_data_ptr);
                               } else {
                                   ESP_LOGE(TAG, "Characteristic #%u %s (%s) value = %s (0x%" PRIx8 "), unexpected value.",
                                                   param_descriptor->cid,
                                                   param_descriptor->param_key,
                                                   param_descriptor->param_units,
                                                   (const char*)rw_str,
                                                   *(uint8_t*)temp_data_ptr);
                                   alarm_state = true;
                                   break;
                               }
                               if (state & param_descriptor->param_opts.opt1) {
                                   alarm_state = true;
                                   break;
                               }
                           }
                       } else {
                           ESP_LOGE(TAG, "Characteristic #%u (%s) read fail, err = 0x%x (%s).",
                                           param_descriptor->cid,
                                           param_descriptor->param_key,
                                           (int)err,
                                           (char*)esp_err_to_name(err));
                       }
                   }
                   vTaskDelay(POLL_TIMEOUT_TICS); // timeout between polls
               }
           }
           vTaskDelay(UPDATE_CIDS_TIMEOUT_TICS);
       }
   
       if (alarm_state) {
           ESP_LOGI(TAG, "Alarm triggered by cid #%u.", param_descriptor->cid);
       } else {
           ESP_LOGE(TAG, "Alarm is not triggered after %u retries.", MASTER_MAX_RETRY);
       }
       ESP_LOGI(TAG, "Destroy master...");
       ESP_ERROR_CHECK(mbc_master_destroy());
   }
   
   // Modbus master initialization
   static esp_err_t master_init(void)
   {
       // Initialize and start Modbus controller
       mb_communication_info_t comm = {
               .port = MB_PORT_NUM,
   #if CONFIG_MB_COMM_MODE_ASCII
               .mode = MB_MODE_ASCII,
   #elif CONFIG_MB_COMM_MODE_RTU
               .mode = MB_MODE_RTU,
   #endif
               .baudrate = MB_DEV_SPEED,
               .parity = MB_PARITY_NONE
       };
       void* master_handler = NULL;
   
       esp_err_t err = mbc_master_init(MB_PORT_SERIAL_MASTER, &master_handler);
       MB_RETURN_ON_FALSE((master_handler != NULL), ESP_ERR_INVALID_STATE, TAG,
                                   "mb controller initialization fail.");
       MB_RETURN_ON_FALSE((err == ESP_OK), ESP_ERR_INVALID_STATE, TAG,
                               "mb controller initialization fail, returns(0x%x).", (int)err);
       err = mbc_master_setup((void*)&comm);
       MB_RETURN_ON_FALSE((err == ESP_OK), ESP_ERR_INVALID_STATE, TAG,
                               "mb controller setup fail, returns(0x%x).", (int)err);
   
       // Set UART pin numbers
       err = uart_set_pin(MB_PORT_NUM, CONFIG_MB_UART_TXD, CONFIG_MB_UART_RXD,
                                 CONFIG_MB_UART_RTS, UART_PIN_NO_CHANGE);
       MB_RETURN_ON_FALSE((err == ESP_OK), ESP_ERR_INVALID_STATE, TAG,
           "mb serial set pin failure, uart_set_pin() returned (0x%x).", (int)err);
   
       err = mbc_master_start();
       MB_RETURN_ON_FALSE((err == ESP_OK), ESP_ERR_INVALID_STATE, TAG,
                               "mb controller start fail, returned (0x%x).", (int)err);
   
       // Set driver mode to Half Duplex
       err = uart_set_mode(MB_PORT_NUM, UART_MODE_RS485_HALF_DUPLEX);
       MB_RETURN_ON_FALSE((err == ESP_OK), ESP_ERR_INVALID_STATE, TAG,
               "mb serial set mode failure, uart_set_mode() returned (0x%x).", (int)err);
   
       vTaskDelay(5);
       err = mbc_master_set_descriptor(&device_parameters[0], num_device_parameters);
       MB_RETURN_ON_FALSE((err == ESP_OK), ESP_ERR_INVALID_STATE, TAG,
                                   "mb controller set descriptor fail, returns(0x%x).", (int)err);
       ESP_LOGI(TAG, "Modbus master stack initialized...");
       return err;
   }
   
   void app_main(void)
   {
       // Initialization of device peripheral and objects
       ESP_ERROR_CHECK(master_init());
       vTaskDelay(10);
   
       master_operation_func(NULL);
   }    `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "master.c";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-row items-center gap-20 mb-4 -ml-8">
        <label>Parameter Address</label>
        <label>Function Code</label>
        <label>Value to Write if Writing</label>
      </div>
      {rows.map((row, index) => (
        <div key={index} className="flex flex-row items-center gap-4 mb-4">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              name="input1"
              value={row.input1}
              onChange={(e) => handleChange(e, index)}
              className="border rounded px-2 py-1"
              placeholder="Input 1"
            />
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              name="input2"
              value={row.input2}
              onChange={(e) => handleChange(e, index)}
              className="border rounded px-2 py-1"
              placeholder="Input 2"
            />
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              name="input3"
              value={row.input3}
              onChange={(e) => handleChange(e, index)}
              className="border rounded px-2 py-1"
              placeholder="Input 3"
            />
          </div>
          <button
            onClick={() => handleRemoveRow(index)}
            className="flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-700 text-white rounded"
          >
            <div className="relative flex items-center justify-center w-full h-full">
              <div className="absolute w-[4px] h-full bg-white transform rotate-45" />
              <div className="absolute w-[4px] h-full bg-white transform -rotate-45" />
            </div>
          </button>
        </div>
      ))}
      <div className="flex flex-row gap-2">
        <button
          onClick={handleAddRow}
          className="mt-4 bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Add Row
        </button>
        <button
          onClick={handleDownload}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Download master.c
        </button>
      </div>
    </main>
  );  
}