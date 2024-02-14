import { Customer } from '../../components/Customer';
import { States } from '../../components/Customer/types';

export const AddCustomer = () => {
    return <Customer state={States.Add} />;
};
