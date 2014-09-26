'use strict';

Bahmni.Clinical.DrugOrder = (function () {
    var DateUtil = Bahmni.Common.Util.DateUtil;

    var DrugOrder = function (drugOrderData) {
        angular.extend(this, drugOrderData);
    };

    DrugOrder.create = function (drugOrderData) {
        return new DrugOrder(drugOrderData);
    };

    DrugOrder.createFromUIObject = function (drugOrderData) {
        var dateUtil = Bahmni.Common.Util.DateUtil;
        var getDosingInstructions = function(drugOrderData) {
            var dosingInstructions = {};
            dosingInstructions.instructions = drugOrderData.instructions && drugOrderData.instructions;
            dosingInstructions.additionalInstructions = drugOrderData.additionalInstructions;
            if (drugOrderData.frequencyType === Bahmni.Clinical.Constants.dosingTypes.variable) {
                dosingInstructions.morningDose = drugOrderData.variableDosingType.morningDose;
                dosingInstructions.afternoonDose = drugOrderData.variableDosingType.afternoonDose;
                dosingInstructions.eveningDose = drugOrderData.variableDosingType.eveningDose;
            }
            return JSON.stringify(dosingInstructions);
        };
        var doseUnits = drugOrderData.isUniformDosingType() && !drugOrderData.isCurrentDosingTypeEmpty() ? drugOrderData.uniformDosingType.doseUnits : drugOrderData.variableDosingType.doseUnits;

        var frequency = drugOrderData.isUniformDosingType() && !drugOrderData.isCurrentDosingTypeEmpty() ? drugOrderData.uniformDosingType.frequency.name : null;

        var route = drugOrderData.route ? drugOrderData.route.name : null;

        var drugOrder = new DrugOrder({
                careSetting: "Outpatient",
                drug: {name:drugOrderData.drugName},
                orderType: "Drug Order",
                dosingInstructionType: drugOrderData.dosingInstructionType,
                dosingInstructions: {
                    dose: drugOrderData.uniformDosingType.dose,
                    doseUnits: doseUnits,
                    route: route,
                    frequency: frequency,
                    asNeeded: drugOrderData.asNeeded,
                    administrationInstructions: getDosingInstructions(drugOrderData),
                    quantity: drugOrderData.quantity,
                    quantityUnits: drugOrderData.quantityUnit,
                    numberOfRefills: 0},
                duration: drugOrderData.duration,
                durationUnits: drugOrderData.durationUnit.name,
                scheduledDate: dateUtil.parse(drugOrderData.scheduledDate),
                dateStopped: dateUtil.addDays(dateUtil.parse(drugOrderData.scheduledDate), drugOrderData.durationInDays),
                previousOrderUuid: drugOrderData.previousOrderUuid,
                action: drugOrderData.action
            }
        );
        return drugOrder;
    };

    DrugOrder.prototype = {
        isActiveOnDate: function (date) {
            return date >= DateUtil.getDate(this.effectiveStartDate) && date <= DateUtil.getDate(this.effectiveStopDate);
        },

        isActive: function () {
            return this.isActiveOnDate(DateUtil.today());
        }
    };

    return DrugOrder;
})();