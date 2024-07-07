import { Modal, Form, Input, Checkbox } from 'antd';
import { Task } from '../../store/types';

import { CheckboxContainer } from './TaskModalStyles';

const { TextArea } = Input;

type TaskModalProps = {
  isVisible: boolean;
  editingItem: Task | null;
  form: any;
  onOk: () => void;
  onCancel: () => void;
};

function TaskModal({
  isVisible,
  editingItem,
  form,
  onOk: handleModalOk,
  onCancel: handleModalCancel,
}: TaskModalProps) {
  return (
    <Modal
      title={editingItem ? 'Изменить задачу' : 'Добавить задачу'}
      open={isVisible}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
      okText={editingItem ? 'Изменить' : 'Добавить'}
    >
      <Form form={form} layout='vertical' name='add_task_form'>
        <Form.Item
          name='title'
          label='Заголовок'
          rules={[
            { required: true, message: 'Пожалуйста, введите заголовок задачи' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='description'
          label='Описание'
          rules={[
            { required: true, message: 'Пожалуйста, введите описание задачи' },
          ]}
        >
          <TextArea rows={5} />
        </Form.Item>
        <CheckboxContainer>
          <Form.Item name='favorite' valuePropName='checked'>
            <Checkbox aria-label='Добавить в избранное'>
              Добавить в избранное
            </Checkbox>
          </Form.Item>
          <Form.Item name='completed' valuePropName='checked'>
            <Checkbox aria-label='Отметить как выполненное'>
              Отметить как выполненное
            </Checkbox>
          </Form.Item>
        </CheckboxContainer>
      </Form>
    </Modal>
  );
}

export default TaskModal;
