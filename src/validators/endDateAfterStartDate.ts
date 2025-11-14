import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';

export function EndDateAfterStartDate(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'EndDateAfterStartDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const relatedValue = (args.object as any)['startDate'];
                    if (!(value instanceof Date) || !(relatedValue instanceof Date)) {
                        return false;
                    }
                    return value > relatedValue; // endDate > startDate
                },
                defaultMessage(args: ValidationArguments) {
                    return `endDate must be after startDate`;
                },
            },
        });
    };
}
