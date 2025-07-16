import { Button } from '@mantine/core';

export function IconButton({
    icon: Icon,
    iconclass,
    onClick,
    children,
    ...props
}: {
    icon: React.ComponentType;
    iconclass?: string;
    onClick: () => void;
    children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<'button'>) {
    return (
        <Button
            variant="light"
            color="blue"
            radius={'18px'}
            size="sm"
            onClick={onClick}
            {...props}
            style={{
                padding: '0 12px 0 12px',
                height: 36,
                margin: '0 0 0 5px',
            }}
        >
            <div className={`${iconclass}`} style={{ display: 'flex', alignItems: 'center' }}>
                <Icon />
            </div>
            {children}
        </Button>
    );
}