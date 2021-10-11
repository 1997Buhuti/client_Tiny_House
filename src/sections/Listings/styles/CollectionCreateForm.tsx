import React, { useState } from 'react';
import { Button, Modal, Form, Input, Radio } from 'antd';
//import { Form } from '@ant-design/compatible';

interface Values {
    title: string;
    description: string;
    modifier: string;
}

interface CollectionCreateFormProps {
    visible: boolean;
    onCreate: (values: Values) => void;
    onCancel: () => void;
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
    visible,
    onCreate,
    onCancel,
    }) => {
    const [form] = Form.useForm();
    return (
    <Modal
    visible={visible}
    title="Create a new collection"
    okText="Create"
    cancelText="Cancel"
    onCancel={onCancel}
    onOk={() => {
        form
            .validateFields()
            .then((values: Values) => {
                form.resetFields();
                onCreate(values);
            })
            .catch((info: any) => {
                console.log('Validate Failed:', info);
            });
    }}
>
    <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
    >
    <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Please input the title of collection!' }]}
    >
        <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
        <Input type="textarea" />
        </Form.Item>
        <Form.Item name="modifier" className="collection-create-form_last-form-item">
        <Radio.Group>
        <Radio value="public">Public</Radio>
        <Radio value="private">Private</Radio>
        </Radio.Group>
        </Form.Item>
        </Form>
        </Modal>
);
};

const CollectionsPage = () => {
    const [visible, setVisible] = useState(false);

    const onCreate = (values: any) => {
        console.log('Received values of form: ', values);
        setVisible(false);
    };
