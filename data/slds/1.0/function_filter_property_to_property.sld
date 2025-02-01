<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor version="1.0.0"
    xmlns="http://www.opengis.net/sld"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">
    <NamedLayer>
        <Name>Function Property to Property</Name>
        <UserStyle>
            <Name>Function Property to Property</Name>
            <FeatureTypeStyle>
                <Rule>
                    <Name>Property Comparison Rule</Name>
                    <ogc:Filter>
                        <ogc:And>
                            <ogc:PropertyIsEqualTo>
                                <ogc:PropertyName>posledni_hodnota</ogc:PropertyName>
                                <ogc:PropertyName>posledni_hodnota_sekundarni</ogc:PropertyName>
                            </ogc:PropertyIsEqualTo>
                            <ogc:PropertyIsGreaterThan>
                                <ogc:PropertyName>value1</ogc:PropertyName>
                                <ogc:PropertyName>value2</ogc:PropertyName>
                            </ogc:PropertyIsGreaterThan>
                            <ogc:PropertyIsLessThan>
                                <ogc:PropertyName>count1</ogc:PropertyName>
                                <ogc:PropertyName>count2</ogc:PropertyName>
                            </ogc:PropertyIsLessThan>
                            <ogc:PropertyIsGreaterThanOrEqualTo>
                                <ogc:PropertyName>threshold1</ogc:PropertyName>
                                <ogc:PropertyName>threshold2</ogc:PropertyName>
                            </ogc:PropertyIsGreaterThanOrEqualTo>
                            <ogc:Function name="lessThanOrEqualTo">
                                <ogc:PropertyName>posledni_hodnota</ogc:PropertyName>
                                <ogc:PropertyName>spa1h</ogc:PropertyName>
                            </ogc:Function>
                            <ogc:PropertyIsNotEqualTo>
                                <ogc:PropertyName>status</ogc:PropertyName>
                                <ogc:Literal>NULL</ogc:Literal>
                            </ogc:PropertyIsNotEqualTo>
                        </ogc:And>
                    </ogc:Filter>
                    <PointSymbolizer>
                        <Graphic>
                            <Mark>
                                <WellKnownName>square</WellKnownName>
                                <Fill>
                                    <CssParameter name="fill">#FF0000</CssParameter>
                                </Fill>
                                <Stroke>
                                    <CssParameter name="stroke">#000000</CssParameter>
                                    <CssParameter name="stroke-width">1</CssParameter>
                                </Stroke>
                            </Mark>
                            <Size>5</Size>
                        </Graphic>
                    </PointSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
</StyledLayerDescriptor> 