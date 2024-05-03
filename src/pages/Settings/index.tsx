import { Container, Tabs } from '@mantine/core';
import { SettingsForm } from '../../components/SettingsForm';
import { IconPaperBag, IconSettings } from '@tabler/icons-react';
import { DataForm } from '../../components/DataForm';

export const Settings = () => {
    return (
        <Container size='md'>
            <Tabs defaultValue='settings'>
                <Tabs.List justify='center'>
                    <Tabs.Tab value='settings' leftSection={<IconSettings />}>
                        Settings
                    </Tabs.Tab>
                    <Tabs.Tab value='data' leftSection={<IconPaperBag />}>
                        Data
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value='settings'>
                    <SettingsForm />
                </Tabs.Panel>

                <Tabs.Panel value='data'>
                    <DataForm />
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
};
