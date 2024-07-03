'use client';
import Papa from "papaparse";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv, faCircleInfo } from '@fortawesome/free-solid-svg-icons';


export default function Home() {
  const [rows, setRows] = useState([{ input1: "", input2: "", input3: "" }]);    
  const [selectedInverter, setSelectedInverter] = useState('Sungold');
  const [csvData, setCsvData] = useState([]);

  const options = [
    { value: "0xA", label: "0xA" },
    { value: "0xB", label: "0xB" },
    { value: "0x16", label: "0x16" },
    { value: "0x1A", label: "0x1A" },
    { value: "0x1B", label: "0x1B" },
    { value: "0x1C", label: "0x1C" },
    { value: "0x21", label: "0x21" },
    { value: "0x35", label: "0x35" },
    { value: "0x100", label: "0x100" },
    { value: "0x101", label: "0x101" },
    { value: "0x102", label: "0x102" },
    { value: "0x103", label: "0x103" },
    { value: "0x104", label: "0x104" },
    { value: "0x105", label: "0x105" },
    { value: "0x106", label: "0x106" },
    { value: "0x107", label: "0x107" },
    { value: "0x108", label: "0x108" },
    { value: "0x109", label: "0x109" },
    { value: "0x10A", label: "0x10A" },
    { value: "0x10B", label: "0x10B" },
    { value: "0x10C", label: "0x10C" },
    { value: "0x10D", label: "0x10D" },
    { value: "0x10E", label: "0x10E" },
    { value: "0x10F", label: "0x10F" },
    { value: "0x110", label: "0x110" },
    { value: "0x111", label: "0x111" },
    { value: "0x112", label: "0x112" },
    { value: "0x113", label: "0x113" },
    { value: "0x114", label: "0x114" },
    { value: "0x115", label: "0x115" },
    { value: "0x116", label: "0x116" },
    { value: "0x117", label: "0x117" },
    { value: "0x118", label: "0x118" },
    { value: "0x119", label: "0x119" },
    { value: "0x11A", label: "0x11A" },
    { value: "0x11B", label: "0x11B" },
    { value: "0x200", label: "0x200" },
    { value: "0x204", label: "0x204" },
    { value: "0x20F", label: "0x20F" },
    { value: "0x210", label: "0x210" },
    { value: "0x211", label: "0x211" },
    { value: "0x212", label: "0x212" },
    { value: "0x213", label: "0x213" },
    { value: "0x214", label: "0x214" },
    { value: "0x215", label: "0x215" },
    { value: "0x216", label: "0x216" },
    { value: "0x217", label: "0x217" },
    { value: "0x218", label: "0x218" },
    { value: "0x219", label: "0x219" },
    { value: "0x21B", label: "0x21B" },
    { value: "0x21C", label: "0x21C" },
    { value: "0x21D", label: "0x21D" },
    { value: "0x21E", label: "0x21E" },
    { value: "0x21F", label: "0x21F" },
    { value: "0x220", label: "0x220" },
    { value: "0x221", label: "0x221" },
    { value: "0x222", label: "0x222" },
    { value: "0x223", label: "0x223" },
    { value: "0x224", label: "0x224" },
    { value: "0x225", label: "0x225" },
    { value: "0x226", label: "0x226" },
    { value: "0x227", label: "0x227" },
    { value: "0x228", label: "0x228" },
    { value: "0x229", label: "0x229" },
    { value: "0x22A", label: "0x22A" },
    { value: "0x22B", label: "0x22B" },
    { value: "0x22C", label: "0x22C" },
    { value: "0x22D", label: "0x22D" },
    { value: "0x22E", label: "0x22E" },
    { value: "0x22F", label: "0x22F" },
    { value: "0x230", label: "0x230" },
    { value: "0x231", label: "0x231" },
    { value: "0x232", label: "0x232" },
    { value: "0x233", label: "0x233" },
    { value: "0x234", label: "0x234" },
    { value: "0x235", label: "0x235" },
    { value: "0x236", label: "0x236" },
    { value: "0x237", label: "0x237" },
    { value: "0x238", label: "0x238" },
    { value: "0x239", label: "0x239" },
    { value: "0x23A", label: "0x23A" }
  ];
  
  const regAddrToIndex = new Map([
    [0xA, 0],
    [0xB, 1],
    [0x16, 2],
    [0x1A, 3],
    [0x1B, 4],
    [0x1C, 5],
    [0x21, 6],
    [0x35, 7],
    [0x100, 8],
    [0x101, 9],
    [0x102, 10],
    [0x103, 11],
    [0x104, 12],
    [0x105, 13],
    [0x106, 14],
    [0x107, 15],
    [0x108, 16],
    [0x109, 17],
    [0x10A, 18],
    [0x10B, 19],
    [0x10C, 20],
    [0x10D, 21],
    [0x10E, 22],
    [0x10F, 23],
    [0x110, 24],
    [0x111, 25],
    [0x112, 26],
    [0x113, 27],
    [0x114, 28],
    [0x115, 29],
    [0x116, 30],
    [0x117, 31],
    [0x118, 32],
    [0x119, 33],
    [0x11A, 34],
    [0x11B, 35],
    [0x200, 36],
    [0x204, 37],
    [0x20C, 38],
    [0x20F, 39],
    [0x210, 40],
    [0x211, 41],
    [0x212, 42],
    [0x213, 43],
    [0x214, 44],
    [0x215, 45],
    [0x216, 46],
    [0x217, 47],
    [0x218, 48],
    [0x219, 49],
    [0x21B, 50],
    [0x21C, 51],
    [0x21E, 52],
    [0x21F, 53],
    [0x21A, 62],
    [0x21D, 65],
    [0x220, 68],
    [0x221, 69],
    [0x222, 70],
    [0x223, 71],
    [0x224, 72],
    [0x225, 73],
    [0x226, 74],
    [0x227, 75],
    [0x228, 76],
    [0x229, 77],
    [0x22A, 78],
    [0x22B, 79],
    [0x22C, 80],
    [0x22D, 81],
    [0x22E, 82],
    [0x22F, 83],
    [0x230, 84],
    [0x231, 85],
    [0x232, 86],
    [0x233, 87],
    [0x234, 88],
    [0x235, 89],
    [0x236, 90],
    [0x237, 91],
    [0x238, 92],
    [0x239, 93],
    [0x23A, 94]
  ]);

  useEffect(() => {
    // Fetch the CSV file from the public directory
    fetch("/SunGoldCommandsNew.csv")
      .then((response) => response.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            setCsvData(results.data);
          },
        });
      });
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;//name = input1, input2, or input3. value = value typed into the input box
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

  const handleInverterChange = (e) => {
    setSelectedInverter(e.target.value);
  };

  const inputsToParameters = (input1, input2, input3) => {
    let parameterVals = [];
    const regAddr = parseInt(input1, 16); // Ensure input is parsed as hex
    let index = regAddrToIndex.get(regAddr);

    if (!csvData[index]) {
      console.error(`Index ${index} not found in csvData`);
      return [];
    }
  
    parameterVals[0] = String(csvData[index].English_Name);
    parameterVals[1] = csvData[index].Unit;
    parameterVals[2] = "MB_PARAM_HOLDING";
    parameterVals[3] = input1;
    parameterVals[4] = 1;
    parameterVals[5] = "HOLD_OFFSET(input_data0)";
    //https://docs.espressif.com/projects/esp-modbus/en/latest/esp32/overview_messaging_and_mapping.html#modbus-mapping-complex-data-types
    if(input1 == 0x21 || input1 == 0x35){
      parameterVals[6] = "PARAM_TYPE_ASCII";
      parameterVals[8] = "OPTS( 0, 100, 1 )";
    }else if(csvData[index].Display_Format == "%.1fV" || csvData[index].Display_Format == "%.1fA" || csvData[index].Display_Format == "%.1f℃" || csvData[index].Display_Format == "%.2fA" || csvData[index].Display_Format == "%.2fHz"){
      parameterVals[6] = "PARAM_TYPE_FLOAT";
      parameterVals[8] = "OPTS( 0x0, 0xFF, 1 )";
    }else if(csvData[index].Length == 1 && csvData[index].Signed_Unsigned == "Unsigned"){
        console.log("data tpye: " + csvData[index].Display_Format);
        parameterVals[6] = "PARAM_TYPE_U8";
        parameterVals[8] = "OPTS( 0x0, 0xFF, 1 )";
    } else if(csvData[index].Length == 1 && csvData[index].Signed_Unsigned == "Signed"){
        console.log("data tpye: " + csvData[index].Data_Type);
        parameterVals[6] = "PARAM_TYPE_I8_A"; //could be PARAM_TYPE_I8_B
        parameterVals[8] = "OPTS( 0x80, 0xEF, 1 )";
    } else if (csvData[index].Length == 2 && csvData[index].Signed_Unsigned == "Unsigned"){
        parameterVals[6] = "PARAM_TYPE_U16";
        parameterVals[8] = "OPTS( 0x0, 0xFFFF, 1 )";
    } else if (csvData[index].Length == 2 && csvData[index].Signed_Unsigned == "Signed"){
        parameterVals[6] = "PARAM_TYPE_I16_AB"; //could be PARAM_TYPE_I16_BA
        parameterVals[8] = "OPTS( 0x8000, 0xEFFF, 1 )";
    } else if(csvData[index].Length == 4 && csvData[index].Signed_Unsigned == "Unsigned"){
        parameterVals[6] = "PARAM_TYPE_U32";
        parameterVals[8] = "OPTS( 0x0, 0xFFFFFFFF, 1 )"; //<-- SHOULD NOT BE A STRING
    } else if(csvData[index].Length == 4 && csvData[index].Signed_Unsigned == "Signed"){
        parameterVals[6] = "PARAM_TYPE_I32_ABCD"; //could be PARAM_TYPE_I32_BADC, PARAM_TYPE_I32_CDAB, PARAM_TYPE_I32_DCBA
        parameterVals[8] = "OPTS( 0x80000000, 0xEFFFFFFF, 1 )";
    }
    // console.log("Data Type: " + parameterVals[6]);
    parameterVals[7] = csvData[index].Length;
    // console.log("OPTS: " + parameterVals[8]);
    return parameterVals;
  };

    // Master C file generator
  const handleDownload = () => {
    let newParameters = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (row.input1 === "" || row.input2 === "") {
        alert("Inputs 1 and 2 must be filled for every row.");
        return;
      }
      if (!["3", "6", "03", "06"].includes(row.input2)) {
        alert("Input2 must be 3, 6, 03, or 06.");
        return;
      }
      if (row.input3 === "" && row.input2 === "06") {
        alert("Wherever funciton code 06 is used, the corresponding input3 must have a write value.");
        return;
      }
      newParameters.push(inputsToParameters(row.input1, row.input2, row.input3));
    }


  const parametersContent = newParameters.map((params) => `
    { CID_INP_DATA_0, STR("${params[0]}"), STR("${params[1]}"), MB_DEVICE_ADDR1, ${params[2]},
    ${params[3]}, ${params[4]}, ${params[5]}, ${params[6]}, ${params[7]},
    ${params[8]}, PAR_PERMS_READ_WRITE_TRIGGER }
  `).join(',');

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
      <div className="flex flex-row gap-2 mb-4">
        Select Your Inverter
      </div>
      <div className="flex flex-row gap-2 mb-14">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="sungold"
            name="options"
            value="Sungold"
            checked={selectedInverter === 'Sungold'}
            onChange={handleInverterChange}
            className="hidden"

          />
          <label
            htmlFor="sungold"
            className={selectedInverter === 'Sungold' ? 'button-23' : 'button-24'}
            >
            Sungold
          </label>

          <input
            type="radio"
            id="meanwell"
            name="options"
            value="Meanwell"
            checked={selectedInverter === 'Meanwell'}
            onChange={handleInverterChange}
            className="hidden"
          />
          <label
            htmlFor="meanwell"
            className={selectedInverter === 'Meanwell' ? 'button-23' : 'button-24'}
            >
            Meanwell
          </label>

          <input
            type="radio"
            id="powMr"
            name="options"
            value="PowMr"
            checked={selectedInverter === 'PowMr'}
            onChange={handleInverterChange}
            className="hidden"
          />
          <label
            htmlFor="powMr"
            className={selectedInverter === 'PowMr' ? 'button-23' : 'button-24'}
            >
            PowMr
          </label>
        </div>
      </div>
      <div className="flex flex-row items-center gap-12 mb-4 -ml-16">
        <label>Reg Address (Hex)</label>
        <div className="flex flex-row">
        <label>Function Code </label>
        <button
          className="text-white rounded flex items-center ml-2"
          onClick={() => alert("In this field, enter 03 for reading a value and 06 for writing a value.")}
        >
          <FontAwesomeIcon icon={faCircleInfo} style={{color: "#e86bdc",}} className="ml-2" />
        </button>
        </div>
        <label>Value to Write if Writing</label>
      </div>
      {rows.map((row, index) => (
        <div key={index} className="flex flex-row items-center gap-4 mb-4">
          <div className="flex flex-col gap-2">
            <select
              name="input1"
              value={row.input1}
              onChange={(e) => handleChange(e, index)}
              className="border rounded px-2 py-1"
            >
              <option value="" disabled>Select Input 1</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              name="input2"
              value={row.input2}
              onChange={(e) => handleChange(e, index)}
              className="border rounded px-2 py-1"
              placeholder="Input 2 (ex: 03 or 06)"
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
          className="mt-8 bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Add Row
        </button>
        <button
          onClick={handleDownload}
          className="mt-8 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Download master.c
        </button>
        <a
          href="/SunGoldCommandsNew.csv"
          download
          className="mt-8 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          <FontAwesomeIcon icon={faFileCsv} className="mr-2" />
          SunGold Commands
        </a>
      </div>
      </main>
  );  
}